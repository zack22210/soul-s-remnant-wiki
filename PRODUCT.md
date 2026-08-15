# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary visitors are English-speaking Steam and console players searching for practical, game-specific answers, walkthroughs, platform information, and reference material.
- The operator repeatedly launches a new standalone game wiki by cloning this repository, reviewing the proposed keyword plan, and then generating content with Seoscout.

## Product Purpose

Provide a reusable static wiki foundation for Steam and console games. A new site should be created from a small configuration and raw keyword input, then move through explicit research, keyword approval, asset completion, article generation, localization, and release verification stages.

Success means a cloned repository contains no previous-game residue, never publishes unsupported game claims or fabricated sections, and can produce a useful 40–60 article wiki without hand-editing brand strings across the codebase.

## Positioning

Unlike a generic content theme, this template encodes a guarded editorial workflow: game-specific modules exist only when supported by evidence and search demand, keyword approval is invalidated by later edits, and publication is blocked until the final domain and required assets are configured.

## Operating Context

- The operator supplies a game topic and raw keywords collected from Similarweb, Google Trends, and high-traffic YouTube titles.
- English is always the default locale. Additional locales are recommended per game during research and must be explicitly recorded before translation.
- Seoscout performs search, collection, MDX generation, translation, and content synchronization after keyword approval.
- Favicon and hero/media assets are completed with Codex after the preparation stage produces an asset checklist.
- The production domain is commonly purchased after article generation.

## Capabilities and Constraints

- Next.js 15 App Router static site, MDX content, next-intl localization, and Bun-based project scripts.
- Steam and console games only; Roblox-specific concepts and defaults are excluded.
- Preserve the reusable layout, components, advertising slots, privacy policy, terms, copyright page, and about-page structure.
- Do not create placeholder redemption codes or force sections such as achievements, endings, system requirements, platforms, or characters when the game evidence and keyword set do not support them.
- `keywords.json` must be reviewed before Seoscout article generation. Approval is tied to the reviewed file contents.
- Domain-dependent release checks remain pending until a real domain is supplied.
- No backend or database.

## Brand Commitments

- Every generated site is an independent, unofficial fan guide and must not imply publisher, platform, or developer affiliation.
- Game facts must be traceable to accessible official sources, official storefronts, official media, community sources where appropriate, or established editorial sources.
- Competitor wikis and broken links must not be published as references.

## Evidence on Hand

- The repository contains a complete prior-game implementation demonstrating the layout and MDX content model.
- `seoscout/` contains the current generation pipeline and accuracy-focused article prompt.
- The operator supplied the previous research, homepage, keyword clustering, rebranding, navigation, localization, and validation prompts; these are inputs for the new consolidated workflow.
- No claims, media, testimonials, or brand assets may be invented for a future game.

## Product Principles

1. Evidence before modules: only expose sections that the game and keyword research justify.
2. Human approval before scale: never spend generation budget before the keyword plan is explicitly approved.
3. One source for each fact: brand, links, locales, taxonomy, and domain each have a canonical configuration source.
4. Empty is safer than stale: a fresh clone shows a deliberate setup state instead of another game's content.
5. Release checks are gates: old-brand residue, missing assets, invalid MDX, broken navigation, and absent production domain are visible failures.

