import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");

const files = [
  "index.html",
  "portfolio.html",
  "project.html",
  "styles.css",
  "script.js",
  ".nojekyll",
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  await cp(join(root, file), join(dist, file), { recursive: true });
}

await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });

console.log("Deploy files are ready in ./dist");
