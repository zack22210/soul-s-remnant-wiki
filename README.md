# Steam / Console Game Wiki Template

A reusable Next.js 15 static wiki for Steam and console games. The repository intentionally starts without game articles, game artwork, a production domain, or non-English locales.

The template preserves the layout, MDX system, advertising slots, legal pages, SEO surfaces, and Seoscout integration. Game-specific sections are created only when the reviewed research and keyword plan support them.

## Requirements

- Bun (preferred; `bun.lock` is the dependency source of truth)
- Seoscout
- `SERPER_API_KEY` and an OpenAI-compatible `LLM_API_KEY` in `seoscout/.env`

```bash
bun install
bun run seoscout:setup
```

## New wiki workflow

### 1. Supply the game and raw keywords

Edit:

- `inputs/topic.txt` — exact game name
- `inputs/raw-keywords.txt` — one Similarweb, Google Trends, or YouTube-derived keyword per line
- `wiki.config.json` — optional initial values; the production domain may remain `null`

### 2. Create the preparation packet

```bash
bun run wiki:prepare
```

This creates:

- `workspace/prepare-request.md`
- `workspace/待补图片清单.md`

Use Codex to research the game and complete:

- `workspace/site-profile.json`
- `workspace/homepage-modules.json`
- `workspace/languages.json`
- `seoscout/keywords.json`

The research packet must not cite competitor wikis, invent game facts, or force categories such as Codes, achievements, endings, characters, platforms, or system requirements when evidence and search demand do not support them.

### 3. Complete images and approve

Follow `workspace/待补图片清单.md`, then run:

```bash
bun run wiki:approve
```

Approval validates the research artifacts, assets, locales, categories, unsafe keyword filters, and 60-keyword limit. It records a SHA-256 hash of the reviewed files. Any later edit invalidates approval.

### 4. Generate articles

```bash
bun run wiki:generate
```

This verifies the approval hash, runs Seoscout search/collect/generate, runs translation when additional locales were approved, and synchronizes generated MDX into `content/`.

### 5. Add the production domain

The domain may be purchased after article generation:

```bash
bun run wiki:set-domain -- https://your-domain.example
bun run wiki:finalize
```

Finalization requires a real domain, verifies assets and old-game residue, and runs the production build.

Use `bun run wiki:status` at any time to see the current phase and next action.

## Development

```bash
bun run dev
bun run build
bun run lint
```

The unconfigured template is deliberately buildable and displays a setup state. English is served at `/`; approved additional locales use prefixed routes such as `/de` or `/es`.

## Canonical sources

- Site identity, links, domain, locale list, and media paths: `wiki.config.json`
- Approved content taxonomy and keywords: `seoscout/keywords.json`
- Generated navigation: `src/config/navigation.generated.json`
- Generated locale list: `src/config/locales.generated.json`
- English UI content: `src/locales/en.json`
- Article content: `content/<locale>/<category>/*.mdx`
- Workflow state: `.wiki/state.json` (local and ignored by Git)

