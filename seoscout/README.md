# Seoscout pipeline

Seoscout is the article research and generation engine for this Steam/console wiki template. Do not run article generation directly on an unreviewed keyword file.

## Guarded path

```bash
bun run wiki:prepare
bun run wiki:approve
bun run wiki:generate
```

`wiki:approve` writes the approved locale list into `keywords.json`, generates the game-specific accuracy prompt from `prompts/generate.template.md`, and records a hash of every reviewed planning artifact. `wiki:generate` refuses to run if any approved file changed.

## Configuration

Copy `.env.example` to `.env` and set:

- `SERPER_API_KEY`
- `LLM_API_KEY`
- `LLM_API_BASE_URL`
- `LLM_MODEL`

Pages are fetched directly and extracted locally with Trafilatura; no extraction API key is required.

## Manual diagnostic commands

These remain available for troubleshooting after approval:

```bash
bun run seoscout:search
bun run seoscout:collect
bun run seoscout:generate
bun run seoscout:translate
```

Generated articles are stored under `seoscout/output/<topic_slug>/articles/` and copied into the site by `wiki:generate`.
