import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const src = process.env.UTDZ_SRC;
const out = process.env.UTDZ_OUT;

await sharp(src).webp({ quality: 85 }).toFile(out);
const m = await sharp(out).metadata();
console.log("hero.webp", `${m.width}x${m.height}`, fs.statSync(out).size, m.format);
const bytes = fs.readFileSync(out).subarray(0, 12);
console.log("magic", Buffer.from(bytes).toString("ascii").replace(/\0/g, "."));
if (bytes[0] === 0x52 && bytes[8] === 0x57) console.log("VALID_WEBP");
else {
  console.error("INVALID_WEBP");
  process.exit(1);
}