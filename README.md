# Asian Parliamentary Openness Index (APOI)

Data pipeline and website for the Asian Parliamentary Openness Index.

## Environments

| Environment | URL                                                            | Deploy                                        |
| ----------- | -------------------------------------------------------------- | --------------------------------------------- |
| Staging     | https://wevisdemo.github.io/asian-parliamentary-openness-index | GitHub Pages, auto-deployed on push to `main` |
| Production  | _Pending_                                                      | TBD                                           |

## Stack

- [moon](https://moonrepo.dev) — monorepo task runner, wires `data` → `web` build dependency
- `data/` — Python ([uv](https://docs.astral.sh/uv/)) pipeline that fetches and processes index data, outputs CSV files to `data/output/` (currently mock data)
- `web/` — [SvelteKit](https://svelte.dev/docs/kit) + TypeScript + Tailwind CSS ([pnpm](https://pnpm.io)) site that displays and visualizes the CSVs, unit tested with [Vitest](https://vitest.dev)
- Git hooks (husky) — [lint-staged](https://github.com/lint-staged/lint-staged) (Prettier + Ruff) on pre-commit, [commitlint](https://commitlint.js.org) (conventional commits) on commit-msg

## Requirements

| Tool    | Version | Install                                                                         |
| ------- | ------- | ------------------------------------------------------------------------------- |
| Node.js | 24+     | https://nodejs.org or fnm/mise                                                  |
| pnpm    | 11+     | `corepack enable pnpm`                                                          |
| uv      | latest  | https://docs.astral.sh/uv/getting-started/installation/ (manages Python itself) |
| moon    | 2+      | `proto install moon` or https://moonrepo.dev/docs/install                       |

**NixOS / Nix users:** `nix-shell` provides everything above — skip the installs.

## Setup

1. `pnpm install` — installs web dependencies and git hooks
2. `uv sync --project data` — installs Python dependencies
3. `moon run web:build` — generates `data/output/index.csv`, then builds the site
4. `moon run web:dev` — dev server at http://localhost:5173

## Common tasks

```
moon run data:build   # generate CSVs into data/output/
moon run web:dev      # dev server
moon run web:build    # runs data:build first, then builds site
moon run web:check    # svelte-check
moon run web:test     # vitest, runs data:build first
moon run :lint        # lint all projects
moon run :format      # format all projects
```

## Commits

Conventional commits are enforced, e.g. `feat: add country page`, `fix: correct score rounding`.
Pre-commit auto-formats staged files with Prettier (web) and Ruff (data).

## Licenses

Regarding the data, the team intends to open it as Open Data under the [Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/) terms. This means you can use, modify, and build upon the data, but it cannot be used for commercial purposes or to seek profit from the work, and credit must be given to WeVis.

Regarding the source code, the team intends to develop every project as Open Source under the [Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/) terms. This means you can use, modify, and build upon the work, but it cannot be used for commercial purposes or to seek profit from the work. You must provide notice and credit to the work's owner, and the resulting work must be under the same Creative Commons license conditions as the original. WeVis Ltd. and Punch Up Ltd. are joint licensors.
