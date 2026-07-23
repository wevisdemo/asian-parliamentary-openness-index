# @apoi/web

SvelteKit site for the [Asia Parliament Openness Index](../README.md). Displays and visualizes the CSV files produced by the `data` pipeline.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) v2 (Svelte 5) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [pnpm](https://pnpm.io), [Prettier](https://prettier.io), [svelte-check](https://www.npmjs.com/package/svelte-check)

## Data source

The site reads CSVs from `../data/output/`. The `dev` and `build` tasks depend on `data:build`, so moon regenerates the data before running.

## Tasks

Run through moon from the repo root:

```
moon run web:dev      # dev server at http://localhost:5173
moon run web:build    # runs data:build first, then builds the site
moon run web:check    # svelte-check
moon run web:lint     # prettier --check
moon run web:format   # prettier --write
```

You can preview a production build with `pnpm preview`.

> To deploy, you may need an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
