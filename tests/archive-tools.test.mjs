import assert from "node:assert/strict";
import test from "node:test";
import { normalizeArchive } from "../scripts/archive-tools.mjs";

test("normalizes, sorts and excludes the Chanhee profile", () => {
  const root = "INSTA STORIES ARCHIVE";
  const sangyeon = "1. 상연 (Sangyeon)";
  const chanhee = "7. 뉴 (Chanhee)";
  const other = "TBZ on Other People’s Profiles (다른 사람 프로필 속 TBZ)";
  const archive = normalizeArchive({
    generatedAt: "2026-08-10T00:00:00.000Z",
    nodes: [
      { id: "s", name: sangyeon, type: "folder", path: [root] },
      { id: "c", name: chanhee, type: "folder", path: [root] },
      { id: "o", name: other, type: "folder", path: [root] },
      { id: "s1", name: "260731 (1).jpg", type: "file", mimeType: "image/jpeg", path: [root, sangyeon, "2026"] },
      { id: "s2", name: "260801 (1).jpg", type: "file", mimeType: "image/jpeg", path: [root, sangyeon, "2026"] },
      { id: "c1", name: "260731 (1).jpg", type: "file", mimeType: "image/jpeg", path: [root, chanhee, "2026"] },
      { id: "o1", name: "260601 post.mp4", type: "file", mimeType: "video/mp4", path: [root, other] },
    ],
  });

  assert.deepEqual(archive.members.map((member) => member.name), ["Sangyeon"]);
  assert.equal(archive.members[0].media[0].name, "260801 (1).jpg");
  assert.equal(archive.members[0].media[1].month, 7);
  assert.equal(archive.other.media[0].kind, "video");
  assert.equal(archive.other.media[0].month, 6);
  assert.equal(archive.other.media[0].name, "260601 post.mp4");
});
