import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_FOLDER_ID = "1jxa6AG4HFQjW9EdgYjb3jutsJvE2nDlT";

const allowedMembers = [
  ["Sangyeon", /\(Sangyeon\)/iu],
  ["Jacob", /\(Jacob\)/iu],
  ["Younghoon", /\(Younghoon\)/iu],
  ["Hyunjae", /\(Hyunjae\)/iu],
  ["Juyeon", /\(Juyeon\)/iu],
  ["Kevin", /\(Kevin\)/iu],
  ["Q", /\(Changmin\)/iu],
  ["Sunwoo", /\(Sunwoo\)/iu],
  ["Eric", /\(Eric\)/iu],
  ["Haknyeon (2017 - 2025)", /(\(Haknyeon\)|HAKNYEON|학년)/iu],
  ["New (2017 - 2026)", /(\(Chanhee\)|\(New\)|CHANHEE|\bNEW\b|뉴)/iu],
];

function dateCode(value, fallback = "") {
  const match = String(value).match(/^(\d{6})/u);
  if (match) return Number(`20${match[1]}`);
  const time = Date.parse(fallback);
  if (Number.isNaN(time)) return 0;
  const date = new Date(time);
  return Number(`${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`);
}

function compactMedia(node) {
  const kind = node.mimeType.startsWith("image/")
    ? "image"
    : node.mimeType.startsWith("audio/")
      ? "audio"
      : node.mimeType.startsWith("video/")
        ? "video"
        : "other";
  const date = dateCode(node.name, node.modifiedTime);
  const value = String(date).padStart(8, "0");
  return {
    id: node.id,
    name: node.name,
    kind,
    mimeType: node.mimeType,
    date,
    year: Number(value.slice(0, 4)),
    month: Number(value.slice(4, 6)),
  };
}

const newestFirst = (a, b) => b.date - a.date || a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });

export function normalizeArchive(raw) {
  const topFolders = raw.nodes.filter((node) => node.type === "folder" && node.path.length === 1);
  const members = allowedMembers.flatMap(([displayName, rule]) => {
    const folder = topFolders.find((item) => rule.test(item.name));
    if (!folder) return [];
    const media = raw.nodes
      .filter((node) => node.type !== "folder" && node.path[1] === folder.name)
      .map(compactMedia)
      .sort(newestFirst);
    return [{ id: folder.id, name: displayName, media }];
  });

  const otherFolder = topFolders.find((folder) => folder.name.startsWith("TBZ on Other People"));
  const other = {
    id: otherFolder?.id || "122rLCfqR6y7DaSgYQHlNLMw9VkKJGwkT",
    name: "TBZ on Other People’s Profiles",
    media: otherFolder
      ? raw.nodes.filter((node) => node.type !== "folder" && node.path[1] === otherFolder.name).map(compactMedia).sort(newestFirst)
      : [],
  };

  return {
    generatedAt: raw.generatedAt,
    sourceFolderId: ROOT_FOLDER_ID,
    members,
    other,
  };
}

export async function writeNormalized(raw, outputFile) {
  const target = outputFile instanceof URL ? fileURLToPath(outputFile) : outputFile;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(normalizeArchive(raw))}\n`, "utf8");
}
