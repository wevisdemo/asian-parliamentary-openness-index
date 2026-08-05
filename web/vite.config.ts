import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const dataOutputDir = fileURLToPath(new URL('../data/output', import.meta.url));

export default defineConfig({
	server: {
		fs: {
			allow: [dataOutputDir]
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			alias: {
				$data: dataOutputDir
			},

			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter(),

			paths: {
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`
			}
		})
	]
});
