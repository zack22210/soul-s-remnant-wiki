#!/usr/bin/env node
/**
 * Generate one isolated HTML document per Adsterra banner placement.
 * Keys are read from local env files or the build environment.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..");
const outDir = join(root, "public", "ads");

const SIZES = {
  "320x50": { width: 320, height: 50, env: "NEXT_PUBLIC_AD_MOBILE_320X50" },
  "300x250": { width: 300, height: 250, env: "NEXT_PUBLIC_AD_BANNER_300X250" },
  "728x90": { width: 728, height: 90, env: "NEXT_PUBLIC_AD_BANNER_728X90" },
  "468x60": { width: 468, height: 60, env: "NEXT_PUBLIC_AD_BANNER_468X60" },
  "160x600": { width: 160, height: 600, env: "NEXT_PUBLIC_AD_SIDEBAR_160X600" },
  "160x300": { width: 160, height: 300, env: "NEXT_PUBLIC_AD_SIDEBAR_160X300" },
};

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equals = trimmed.indexOf("=");
      if (equals === -1) continue;
      const name = trimmed.slice(0, equals).trim();
      const value = trimmed.slice(equals + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
      if (value && !process.env[name]) process.env[name] = value;
    }
  } catch {
    // Env files are optional; deployment variables can supply the keys instead.
  }
}

loadEnvFile(join(root, ".env.local"));
loadEnvFile(join(root, ".env.production"));
loadEnvFile(join(root, ".env.development"));
loadEnvFile(join(root, ".env"));

function buildHtml(key, width, height) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>html, body { margin: 0; padding: 0; border: 0; background: transparent; overflow: hidden; }</style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        key: "${key}",
        format: "iframe",
        height: ${height},
        width: ${width},
        params: {},
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
  </body>
</html>
`;
}

mkdirSync(outDir, { recursive: true });
let generated = 0;

for (const [format, { width, height, env }] of Object.entries(SIZES)) {
  const key = process.env[env]?.trim();
  if (!key || key === "0") {
    console.warn(`skip banner-${format}.html (${env} is empty or disabled)`);
    continue;
  }
  if (!/^[a-f0-9]{32}$/i.test(key)) {
    throw new Error(`${env} must be a 32-character hexadecimal Adsterra key`);
  }
  writeFileSync(join(outDir, `banner-${format}.html`), buildHtml(key, width, height));
  console.log(`wrote banner-${format}.html`);
  generated++;
}

if (generated === 0) {
  console.warn("No banner HTML generated. Configure NEXT_PUBLIC_AD_* banner keys first.");
}
