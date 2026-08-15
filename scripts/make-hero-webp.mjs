import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { execSync } from "child_process";

const require = createRequire(import.meta.url);

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    execSync("npm i sharp --no-save --registry=https://registry.npmmirror.com", {
      stdio: "inherit",
    });
    return require("sharp");
  }
}

const srcDir = process.env.UTDZ_REQ;
const outDir = process.env.UTDZ_IMG;
const sharp = loadSharp();
const heroes = ["hero-1.png", "hero-2.png", "hero-3.png", "hero-4.png", "hero-5.png"];

let best = heroes[0];
let bestScore = -1;

for (const h of heroes) {
  const p = path.join(srcDir, h);
  const m = await sharp(p).metadata();
  console.log(h, `${m.width}x${m.height}`, fs.statSync(p).size);
  const landscapeBonus = (m.width || 0) >= (m.height || 0) ? 1e9 : 0;
  const score = (m.width || 0) * (m.height || 0) + landscapeBonus;
  if (score > bestScore) {
    bestScore = score;
    best = h;
  }
}

console.log("picked", best);
const out = path.join(outDir, "hero.webp");
await sharp(path.join(srcDir, best)).webp({ quality: 82 }).toFile(out);
const om = await sharp(out).metadata();
console.log("hero.webp", `${om.width}x${om.height}`, fs.statSync(out).size, om.format);

const trailer = path.join(outDir, "hero-trailer-thumbnail.jpg");
const tm = await sharp(trailer).metadata();
console.log("trailer", `${tm.width}x${tm.height}`, fs.statSync(trailer).size);