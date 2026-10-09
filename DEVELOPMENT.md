# Development guide

This repository generates a GitHub Profile README and its SVG panels from `data/profile.json`. The generated README is the deliverable; the local server is only a convenient browser preview.

## Structure

- `data/profile.json` — identity, copy, skills, projects, optional links, and avatar metadata.
- `src/generators/` — deterministic SVG and Markdown generators.
- `src/utils/svg.ts` — shared theme tokens and safe SVG helpers.
- `assets/` — generated panels, the portrait, its static hero fallback, and source notes.
- `scripts/` — build and compatibility validation.
- `tests/` — generation and configuration propagation tests.

## Install and verify

```bash
npm install
npm run check
```

`npm run check` type-checks, rebuilds, validates local references and GitHub-safe SVG constraints, then runs the Vitest suite.

## Edit and rebuild

Edit `data/profile.json`, then run:

```bash
npm run build
```

Unknown repository and contact URLs are intentionally empty. Add only verified links. Project links are omitted until configured. To configure profile activity, set `github.username`; no third-party statistics service is used.

## Preview

```bash
npm run build
npm run preview
```

Open `http://localhost:4173/README.md` for a raw browser view, or use a Markdown preview in your editor for the closest GitHub-like result. GitHub's renderer is authoritative. The hero uses lightweight SVG animation and includes `prefers-reduced-motion`; `assets/hero-static.svg` is the non-animated fallback.

## Replace the portrait

Use only artwork you created or have permission to publish. Replace `assets/mizuki-avatar.png`, update every `avatar` attribution field in `data/profile.json`, and record the source URL, creator or copyright holder, and license in `assets/ASSET_SOURCES.md`. Then rebuild. The current image is an original generated placeholder, not official HoYoverse artwork.

## GitHub statistics

The activity panel avoids fragile third-party stat-card services. GitHub already displays contribution activity on a profile. If you later add a statistics provider, document its availability and privacy trade-offs, and retain `assets/achievements.svg` as a static fallback.
