import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the self-contained Instagram stories archive for GitHub Pages", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const assets = await readdir(new URL("../dist/assets/", import.meta.url));
  const scriptName = assets.find((name) => name.endsWith(".js"));
  assert.ok(scriptName, "compiled JavaScript asset is missing");
  const script = await readFile(new URL(`../dist/assets/${scriptName}`, import.meta.url), "utf8");
  assert.match(html, /INSTA STORIES ARCHIVE/);
  assert.match(html, /\.\/assets\//);
  assert.match(script, /SELECT A PROFILE/);
  assert.match(script, /OTHER PEOPLE/);
  assert.match(script, /SEARCH BY YYMMDD OR TITLE/);
  assert.match(script, /Haknyeon \(2017 - 2025\)/);
  assert.match(script, /New \(2017 - 2026\)/);
  assert.doesNotMatch(html, /_next|_vinext/);
});

test("fallback data keeps both former-member tiles available", async () => {
  const members = JSON.parse(await readFile(new URL("../app/data/former-members.generated.json", import.meta.url), "utf8"));
  assert.deepEqual(members.map((member) => member.name), ["Haknyeon (2017 - 2025)", "New (2017 - 2026)"]);
  assert.equal(members[0].media.length, 0);
  assert.ok(members[1].media.length > 0);
});
