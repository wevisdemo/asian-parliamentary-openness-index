# Asia Parliamentary Openness Index

## General Instructions

- This is a moon monorepo with two projects:
  - `web`: SvelteKit v2 (Svelte 5), Tailwind v4, and TypeScript
  - `data`: Python pipeline managed by uv, outputs CSV files to `data/output/`
- Always use pnpm as a package manager for JS, and uv for Python
- On NixOS, the toolchain comes from `shell.nix`, so wrap every command below in `nix-shell --run "<command>"`. Other machines run them as-is
- Skipping the wrapper on NixOS fails in confusing ways, e.g. `data:build` dies with `ImportError: Unable to import required dependency numpy`
- Run tasks through moon when possible, e.g. `moon run web:dev`, `moon run data:build` (`web:build` depends on `data:build`)
- Do not use CSS style block if not necessary, using Tailwind classes is preferable
- Always name source code in kebab-case
- Avoid mutating variables, prefer functional approach when possible
- After finishing any task, run the following commands:
  - Check type with `moon run web:check`
  - Lint with `moon run :lint`, all errors and warnings must be fixed
  - Format code with `moon run :format` before declaring task as done
- Human will get in the loop and edit some file along the way. If you spot it, please respect those changes

## Routing

- The site is deployed to GitHub Pages under a base path, so never hardcode internal links
- Always build internal URLs with `resolve()` from `$app/paths`, e.g. `resolve('/')`, `resolve('/countries/[country]', { country })`
- Hardcoded `href="/..."` passes a local build but fails prerendering in CI with `does not begin with 'base'`
- To reproduce CI locally, build with the base path: `BASE_PATH=/asian-parliamentary-openness-index moon run web:build`

## Git Commit Message Style

- Do not commit unless explicitly asked
- Use conventional commit format
- Don't add body to the commit message. Concisely explain changes to the message title
- If the changes specific to any project, then add its name to the scope, e.g. `feat(web): ...`, `fix(data): ...`
