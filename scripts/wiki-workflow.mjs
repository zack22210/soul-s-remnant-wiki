import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SCRIPT_FILE = path.resolve(process.argv[1]);
const PATHS = {
  config: path.join(ROOT, "wiki.config.json"),
  topic: path.join(ROOT, "inputs", "topic.txt"),
  rawKeywords: path.join(ROOT, "inputs", "raw-keywords.txt"),
  workspace: path.join(ROOT, "workspace"),
  profile: path.join(ROOT, "workspace", "site-profile.json"),
  modules: path.join(ROOT, "workspace", "homepage-modules.json"),
  languages: path.join(ROOT, "workspace", "languages.json"),
  imageTasks: path.join(ROOT, "workspace", "待补图片清单.md"),
  request: path.join(ROOT, "workspace", "prepare-request.md"),
  keywords: path.join(ROOT, "seoscout", "keywords.json"),
  stateDir: path.join(ROOT, ".wiki"),
  state: path.join(ROOT, ".wiki", "state.json"),
  en: path.join(ROOT, "src", "locales", "en.json"),
  navigation: path.join(ROOT, "src", "config", "navigation.generated.json"),
  localeConfig: path.join(ROOT, "src", "config", "locales.generated.json"),
  manifest: path.join(ROOT, "public", "manifest.json"),
};

const command = process.argv[2] || "status";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function cleanInput(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function fail(message) {
  console.error(`\nWiki workflow stopped: ${message}\n`);
  process.exit(1);
}

function warn(message) {
  console.warn(`Warning: ${message}`);
}

function state() {
  return fs.existsSync(PATHS.state)
    ? readJson(PATHS.state)
    : { schemaVersion: 1, phase: "template", updatedAt: new Date().toISOString() };
}

function writeState(next) {
  fs.mkdirSync(PATHS.stateDir, { recursive: true });
  writeJson(PATHS.state, { ...state(), ...next, schemaVersion: 1, updatedAt: new Date().toISOString() });
}

function hashFiles(files) {
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(path.relative(ROOT, file));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function getTopic(config) {
  const topicLines = cleanInput(readText(PATHS.topic));
  return (config.topic || config.gameName || topicLines[0] || "").trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function titleCase(value) {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function validateUrl(value, label, required = false) {
  if (!value) {
    if (required) fail(`${label} is required.`);
    return;
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail(`${label} must be a valid absolute URL.`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) fail(`${label} must use http or https.`);
}

function validateKeywords(data, topic) {
  if (!data || typeof data !== "object") fail("seoscout/keywords.json must be a JSON object.");
  if (data.topic_name?.trim().toLowerCase() !== topic.toLowerCase()) {
    fail(`keywords.json topic_name must exactly match "${topic}".`);
  }
  if (!Array.isArray(data.categories) || data.categories.length === 0 || data.categories.length > 8) {
    fail("keywords.json must contain 1–8 categories.");
  }
  if (!data.categories.some((group) => group.category === "guide")) fail('keywords.json must contain the required "guide" category.');

  const seen = new Set();
  const unsafe = /\b(script|hack|exploit|pastebin|auto farm|auto quest|no key|inf money|cheat engine)\b/i;
  let count = 0;
  for (const group of data.categories) {
    if (!/^[a-z]+$/.test(group.category)) fail(`Category "${group.category}" must be one lowercase English word.`);
    if (!Array.isArray(group.keywords) || group.keywords.length === 0) fail(`Category "${group.category}" has no keywords.`);
    if (group.category === "codes" && group.keywords.length !== 1) fail('The "codes" category must contain exactly one keyword.');
    for (const keyword of group.keywords) {
      count += 1;
      if (typeof keyword !== "string" || !/^[\x20-\x7E]+$/.test(keyword)) fail(`Keyword "${keyword}" must contain ASCII text only.`);
      if (!keyword.toLowerCase().startsWith(`${topic.toLowerCase()} `)) fail(`Keyword "${keyword}" must begin with "${topic} ".`);
      if (unsafe.test(keyword)) fail(`Unsafe keyword intent is not allowed: "${keyword}".`);
      const normalized = keyword.toLowerCase().replace(/\s+/g, " ").trim();
      if (seen.has(normalized)) fail(`Duplicate keyword: "${keyword}".`);
      seen.add(normalized);
    }
  }
  if (count > 60) fail(`Keyword plan contains ${count} keywords; the maximum is 60.`);
  if (count < 40) warn(`Keyword plan contains ${count} keywords. This is below the usual 40–60 target; keep it only when evidence is limited.`);
  return count;
}

function validateLanguages(data) {
  const locales = Array.isArray(data) ? data : data.locales;
  if (!Array.isArray(locales) || locales.length === 0 || locales.length > 4) fail("languages.json must contain 1–4 locale codes.");
  if (locales[0] !== "en" || !locales.includes("en")) fail('English ("en") must be the first and default locale.');
  for (const locale of locales) if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(locale)) fail(`Invalid locale code: ${locale}`);
  if (new Set(locales).size !== locales.length) fail("languages.json contains duplicate locales.");
  return locales;
}

function validateProfile(profile, topic) {
  const requiredStrings = ["gameName", "shortName", "description", "tagline"];
  for (const key of requiredStrings) if (!profile[key]?.trim()) fail(`site-profile.json is missing ${key}.`);
  if (profile.topic?.trim().toLowerCase() !== topic.toLowerCase()) fail(`site-profile.json topic must exactly match "${topic}".`);
  if (!profile.home?.hero?.title || !profile.home?.hero?.description) fail("site-profile.json must contain home.hero title and description.");
  if (!Array.isArray(profile.home?.start?.cards) || profile.home.start.cards.length > 4) fail("home.start.cards must contain no more than four evidence-backed cards.");
  if (!Array.isArray(profile.home?.faq?.items)) fail("home.faq.items must be an array.");
  for (const [label, url] of Object.entries(profile.links || {})) validateUrl(url, `links.${label}`);
}

function validateModules(data, keywords) {
  const modules = Array.isArray(data) ? data : data.modules;
  if (!Array.isArray(modules) || modules.length > 8) fail("homepage-modules.json must contain 0–8 modules.");
  const categories = new Set(keywords.categories.map((group) => group.category));
  for (const [index, module] of modules.entries()) {
    if (!module.name || !module.description || !module.href) fail(`Homepage module ${index + 1} is missing name, description, or href.`);
    if (!['code-cards', 'step-by-step', 'tier-grid', 'card-list'].includes(module.displayType)) fail(`Homepage module ${index + 1} has an invalid displayType.`);
    if (!Array.isArray(module.references) || module.references.length === 0) fail(`Homepage module ${index + 1} requires at least one source URL.`);
    module.references.forEach((url) => {
      validateUrl(url, `module ${index + 1} reference`, true);
      const hostname = new URL(url).hostname.toLowerCase();
      if (/(^|\.)(fandom\.com|wiki\.gg|fextralife\.com)$/.test(hostname)) fail(`Homepage module ${index + 1} cites a competitor wiki: ${url}`);
    });
    if (module.displayType === "card-list" && (module.highlights || []).some((item) => /\p{Extended_Pictographic}/u.test(item.label || ""))) {
      fail(`Homepage module ${index + 1} uses emoji labels. Use short text labels so the UI icon system stays consistent.`);
    }
    if (/codes?/i.test(module.name) && !categories.has("codes")) fail("A codes module exists without an approved codes keyword category.");
  }
  return modules;
}

function requiredAssets(config) {
  const files = [
    "public/favicon.ico",
    "public/favicon-16x16.png",
    "public/favicon-32x32.png",
    "public/apple-touch-icon.png",
    "public/android-chrome-192x192.png",
    "public/android-chrome-512x512.png",
  ];
  for (const value of Object.values(config.media || {})) {
    if (typeof value === "string" && value.startsWith("/")) files.push(`public${value}`);
  }
  return [...new Set(files)];
}

function validateAssets(config) {
  const invalid = requiredAssets(config).filter((relative) => {
    const file = path.join(ROOT, relative);
    if (!fs.existsSync(file) || fs.statSync(file).size < 64) return true;
    const header = fs.readFileSync(file).subarray(0, 12);
    if (relative.endsWith(".png")) return header.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a";
    if (relative.endsWith(".ico")) return header.subarray(0, 4).toString("hex") !== "00000100";
    if (relative.endsWith(".webp")) return header.subarray(0, 4).toString("ascii") !== "RIFF" || header.subarray(8, 12).toString("ascii") !== "WEBP";
    return false;
  });
  if (invalid.length) fail(`Complete the image checklist before approval. Missing or invalid:\n- ${invalid.join("\n- ")}`);
}

function prepare() {
  const config = readJson(PATHS.config);
  const topic = getTopic(config);
  if (!topic) fail("Set wiki.config.json gameName/topic or replace inputs/topic.txt with a game name.");
  if (/\broblox\b/i.test(topic)) fail("This template supports Steam and console games only, not Roblox games.");
  const rawKeywords = cleanInput(readText(PATHS.rawKeywords));
  if (!rawKeywords.length) fail("Paste the collected Similarweb, Google Trends, and YouTube keywords into inputs/raw-keywords.txt.");

  config.topic = topic.toLowerCase();
  if (!config.gameName) config.gameName = topic;
  writeJson(PATHS.config, config);
  fs.mkdirSync(PATHS.workspace, { recursive: true });

  const request = `# Wiki preparation request\n\nGame: ${config.gameName}\nCanonical topic: ${config.topic}\nTarget articles: ${config.targetArticleCount}\n\n## Required outputs\n\nResearch the game using accessible official sources, official storefronts, official media, community sources where appropriate, and established editorial sources. Do not cite competitor wikis. Do not invent unsupported mechanics, missions, endings, achievements, platforms, characters, dates, prices, or communities.\n\nCreate these files:\n\n1. \`workspace/site-profile.json\` following \`workflow/schemas/site-profile.example.json\`.\n2. \`workspace/homepage-modules.json\` with 0–8 evidence-backed modules. Do not add Codes, achievements, endings, requirements, platforms, or characters unless supported by both evidence and search intent.\n3. \`workspace/languages.json\` with English first and at most three additional high-value locales justified by game/store audience evidence.\n4. \`seoscout/keywords.json\` with 1–8 mutually exclusive single-word categories, the required guide category, and at most 60 ASCII keywords. Every keyword must start with \`${config.topic} \`.\n\n## Raw keyword input\n\n${rawKeywords.map((keyword) => `- ${keyword}`).join("\n")}\n`;
  fs.writeFileSync(PATHS.request, request, "utf8");

  const imageTasks = `# 待补图片清单\n\nGame: ${config.gameName}\n\nDo not reuse media from the template's previous game. Generate or source the following after the research profile is complete:\n\n- \`public/favicon.ico\`\n- \`public/favicon-16x16.png\`\n- \`public/favicon-32x32.png\`\n- \`public/apple-touch-icon.png\`\n- \`public/android-chrome-192x192.png\`\n- \`public/android-chrome-512x512.png\`\n- Hero image: record its public path in \`wiki.config.json > media.hero\`\n- Trailer poster when used: record its path in \`media.trailerPoster\`\n- Optional journey and final CTA images only when the approved homepage content benefits from them\n\nAll raster assets must be real, non-empty files with accurate alt/context text.\n`;
  fs.writeFileSync(PATHS.imageTasks, imageTasks, "utf8");
  writeState({ phase: "awaiting_research", topic: config.topic, approvedHash: null });
  console.log(`Preparation packet created for ${config.gameName}.`);
  console.log("Next: have Codex complete workspace/site-profile.json, workspace/homepage-modules.json, workspace/languages.json, and seoscout/keywords.json; then complete the image checklist.");
}

function mergeProfileIntoMessages(messages, profile, modules, categories) {
  messages.site = {
    name: `${profile.gameName} Wiki`,
    shortName: profile.shortName,
    tagline: profile.tagline,
    description: profile.description,
    legalNotice: profile.legalNotice || `Independent fan wiki. Not affiliated with the creators or publishers of ${profile.gameName}.`,
  };
  messages.nav = Object.fromEntries(categories.map((category) => [category, titleCase(category)]));
  for (const category of categories) {
    messages[category] = {
      overviewTitle: titleCase(category),
      overviewDescription: `Browse ${titleCase(category).toLowerCase()} articles for ${profile.gameName}.`,
    };
  }
  messages.home.meta = profile.home.meta;
  messages.home.hero = profile.home.hero;
  messages.home.start = profile.home.start;
  messages.home.aboutGame = profile.home.aboutGame;
  messages.home.explore = {
    title: profile.home.exploreTitle || `${profile.gameName} Guides`,
    description: profile.home.exploreDescription || `Explore practical, evidence-backed guides for ${profile.gameName}.`,
    readFullGuide: "Read full guide",
    modules,
  };
  messages.home.faq = profile.home.faq;
  messages.home.finalCta = profile.home.finalCta;
  messages.footer = { ...messages.footer, ...profile.footer };
  return messages;
}

function approve() {
  for (const file of [PATHS.profile, PATHS.modules, PATHS.languages, PATHS.keywords]) if (!fs.existsSync(file)) fail(`Missing ${path.relative(ROOT, file)}. Run wiki:prepare and complete the research packet first.`);
  const config = readJson(PATHS.config);
  const topic = getTopic(config);
  const profile = readJson(PATHS.profile);
  const keywords = readJson(PATHS.keywords);
  const languages = validateLanguages(readJson(PATHS.languages));
  validateProfile(profile, topic);
  const keywordCount = validateKeywords(keywords, topic);
  const modules = validateModules(readJson(PATHS.modules), keywords);

  config.gameName = profile.gameName;
  config.topic = profile.topic;
  config.locales = languages;
  config.links = { ...config.links, ...(profile.links || {}) };
  config.media = { ...config.media, ...(profile.media || {}) };
  writeJson(PATHS.config, config);
  validateAssets(config);

  keywords.languages = languages.filter((locale) => locale !== "en");
  writeJson(PATHS.keywords, keywords);

  const categories = keywords.categories.map((group) => group.category);
  const featured = modules.slice(0, 5).map((module) => ({
    key: categories.find((category) => module.href === `/${category}` || module.href.startsWith(`/${category}/`)) || categories[0],
    path: module.href,
  })).filter((item, index, items) => item.key && items.findIndex((candidate) => candidate.path === item.path) === index);
  writeJson(PATHS.navigation, { categories: categories.map((key) => ({ key })), featured });
  writeJson(PATHS.localeConfig, { locales: languages });

  for (const locale of languages) {
    const file = path.join(ROOT, "src", "locales", `${locale}.json`);
    if (locale !== "en" && !fs.existsSync(file)) writeJson(file, {});
  }
  for (const file of fs.readdirSync(path.join(ROOT, "src", "locales"))) {
    const locale = file.replace(/\.json$/, "");
    if (file.endsWith(".json") && !languages.includes(locale)) fs.rmSync(path.join(ROOT, "src", "locales", file));
  }

  const messages = mergeProfileIntoMessages(readJson(PATHS.en), profile, modules, categories);
  writeJson(PATHS.en, messages);
  writeJson(PATHS.manifest, {
    id: "/",
    name: `${profile.gameName} Wiki`,
    short_name: profile.shortName,
    description: profile.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#07111f",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  });

  const promptTemplate = readText(path.join(ROOT, "seoscout", "prompts", "generate.template.md"));
  if (promptTemplate) {
    const officialContext = Object.values(config.links).filter(Boolean).join(", ") || "No official link recorded";
    fs.writeFileSync(path.join(ROOT, "seoscout", "prompts", "generate.md"), promptTemplate.replaceAll("{{GAME_NAME}}", profile.gameName).replaceAll("{{OFFICIAL_CONTEXT}}", officialContext), "utf8");
  }

  const approvedFiles = [PATHS.profile, PATHS.modules, PATHS.languages, PATHS.keywords];
  const approvedHash = hashFiles(approvedFiles);
  writeState({ phase: "approved", topic, approvedHash, approvedFiles: approvedFiles.map((file) => path.relative(ROOT, file)), keywordCount });
  console.log(`Approved ${keywordCount} keywords across ${categories.length} categories.`);
  console.log(`Approval hash: ${approvedHash.slice(0, 12)}`);
}

function verifyApproval() {
  const current = state();
  if (current.phase !== "approved" && current.phase !== "generated") fail("The research packet is not approved. Run bun run wiki:approve first.");
  const files = (current.approvedFiles || []).map((file) => path.join(ROOT, file));
  if (!files.length || files.some((file) => !fs.existsSync(file))) fail("Approved files are missing. Run wiki:approve again.");
  const currentHash = hashFiles(files);
  if (currentHash !== current.approvedHash) fail("An approved file changed after review. Run wiki:approve again before generating articles.");
  return current;
}

function run(commandName, args, cwd = ROOT) {
  const result = spawnSync(commandName, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) fail(`${commandName} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${commandName} ${args.join(" ")} exited with status ${result.status}.`);
}

function findExecutable(name) {
  const probe = spawnSync(process.platform === "win32" ? "where.exe" : "which", [name], { encoding: "utf8" });
  return probe.status === 0;
}

function syncArticles(topic) {
  const project = topic.toLowerCase().replace(/\s+/g, "_");
  const source = path.join(ROOT, "seoscout", "output", project, "articles");
  if (!fs.existsSync(source)) fail(`No generated article directory found at ${path.relative(ROOT, source)}.`);
  const destination = path.join(ROOT, "content");
  let count = 0;
  for (const locale of fs.readdirSync(source)) {
    const localeDir = path.join(source, locale);
    if (!fs.statSync(localeDir).isDirectory()) continue;
    for (const category of fs.readdirSync(localeDir)) {
      const categoryDir = path.join(localeDir, category);
      if (!fs.statSync(categoryDir).isDirectory()) continue;
      const targetDir = path.join(destination, locale, category);
      fs.mkdirSync(targetDir, { recursive: true });
      for (const file of fs.readdirSync(categoryDir).filter((name) => name.endsWith(".mdx"))) {
        fs.copyFileSync(path.join(categoryDir, file), path.join(targetDir, file));
        count += 1;
      }
    }
  }
  if (!count) fail("Seoscout output contained no MDX articles.");
  return count;
}

function generate() {
  const approved = verifyApproval();
  const config = readJson(PATHS.config);
  validateAssets(config);
  if (!findExecutable("seoscout")) fail("The seoscout CLI is not installed. Run bun run seoscout:setup first.");
  const seoscoutDir = path.join(ROOT, "seoscout");
  run("seoscout", ["search", "--keywords", "keywords.json"], seoscoutDir);
  run("seoscout", ["collect", "--keywords", "keywords.json"], seoscoutDir);
  run("seoscout", ["generate", "--keywords", "keywords.json", "--prompt", "prompts/generate.md"], seoscoutDir);
  if (config.locales.some((locale) => locale !== "en")) run("seoscout", ["translate", "--keywords", "keywords.json"], seoscoutDir);
  const articleCount = syncArticles(config.topic);
  writeState({ ...approved, phase: "generated", articleCount });
  console.log(`Synced ${articleCount} generated MDX files. Add a domain, then run wiki:finalize.`);
}

function setDomain() {
  const value = process.argv[3];
  validateUrl(value, "domain", true);
  const config = readJson(PATHS.config);
  config.domain = value.replace(/\/$/, "");
  writeJson(PATHS.config, config);
  console.log(`Production domain set to ${config.domain}.`);
}

function scanFiles(directory, extensions, results = []) {
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "seoscout", "workspace"].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) scanFiles(file, extensions, results);
    else if (extensions.some((extension) => entry.name.endsWith(extension))) results.push(file);
  }
  return results;
}

function finalize() {
  const current = state();
  if (current.phase !== "generated") fail("Generate and sync the article library before finalization.");
  const config = readJson(PATHS.config);
  validateUrl(config.domain, "domain", true);
  if (/localhost|example\.(com|org|net)|\.invalid$/i.test(config.domain)) fail("Replace the placeholder domain with the real production domain.");
  validateAssets(config);
  const forbidden = ["Agefield High", "agefield-high-rock-the-school", "Refugium Games", "3562580", "ClY-3UopEeU"];
  const residue = [];
  for (const file of scanFiles(ROOT, [".ts", ".tsx", ".json", ".md", ".mdx", ".mjs"])) {
    if (path.resolve(file) === SCRIPT_FILE) continue;
    const text = readText(file);
    for (const term of forbidden) if (text.includes(term)) residue.push(`${path.relative(ROOT, file)}: ${term}`);
  }
  if (residue.length) fail(`Previous-game residue remains:\n- ${residue.slice(0, 30).join("\n- ")}`);
  const packageManager = findExecutable("bun") ? "bun" : "npm";
  run(packageManager, packageManager === "bun" ? ["run", "build"] : ["run", "build"]);
  writeState({ ...current, phase: "finalized", domain: config.domain });
  console.log("Wiki finalized: production domain, assets, content, residue scan, and build checks passed.");
}

function showStatus() {
  const current = state();
  const config = readJson(PATHS.config);
  console.log(JSON.stringify({
    phase: current.phase,
    gameName: config.gameName || null,
    topic: config.topic || null,
    domain: config.domain,
    locales: config.locales,
    approvedHash: current.approvedHash?.slice(0, 12) || null,
    articleCount: current.articleCount || 0,
    next: current.phase === "template" ? "Fill inputs and run wiki:prepare" : current.phase === "awaiting_research" ? "Complete research, assets, then run wiki:approve" : current.phase === "approved" ? "Run wiki:generate" : current.phase === "generated" ? "Set the domain and run wiki:finalize" : "Ready to publish",
  }, null, 2));
}

switch (command) {
  case "prepare": prepare(); break;
  case "approve": approve(); break;
  case "generate": generate(); break;
  case "set-domain": setDomain(); break;
  case "finalize": finalize(); break;
  case "status": showStatus(); break;
  default: fail(`Unknown command "${command}".`);
}
