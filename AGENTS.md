# AGENTS.md

## Repository purpose

This repository is a reusable Next.js 15 App Router static wiki template for Steam and console games. It is not a Roblox template. There is no backend or database.

## Workflow rules

- Read `PRODUCT.md` and `README.md` before changing game-specific content.
- Treat `wiki.config.json` as the site identity, link, domain, locale, and media source of truth.
- Do not add game-specific claims, homepage modules, navigation categories, or articles without accessible evidence.
- Do not force Codes, tier lists, achievements, endings, requirements, platforms, characters, or other categories when the game and reviewed keyword plan do not support them.
- `bun run wiki:prepare` creates the research and image task packet.
- The operator must review `seoscout/keywords.json` before `bun run wiki:approve`.
- `bun run wiki:generate` must never bypass the approval hash check.
- The production domain is intentionally allowed to remain unset until after article generation; `wiki:finalize` must reject a missing or placeholder domain.
- English is always the default locale. Additional locales come from `workspace/languages.json` and may not exceed four total languages.

## Development

- Package manager: Bun. `bun.lock` is the dependency source of truth.
- Commands: `bun run dev`, `bun run build`, and `bun run lint`.
- Dev server: `http://localhost:3000` on `0.0.0.0:3000`.
- Optional environment values include analytics, ads, and `NEXT_PUBLIC_SITE_URL`.
- Content lives under `content/<locale>/<category>/*.mdx`. Keep the `content/` directory even when it is empty because the MDX import context depends on it.
- Seoscout lives under `seoscout/`; secrets belong in `seoscout/.env` and must never be committed.
- Preserve advertising components, layout primitives, legal-page structure, and the Seoscout workflow when creating a new repository.
- Development is performed locally with Codex. Deployment is handled by Vercel through its Git repository integration; do not add Docker/GHCR deployment workflows unless the hosting strategy changes.
