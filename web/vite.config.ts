import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const dataOutputDir = fileURLToPath(new URL('../data/output', import.meta.url));

export default defineConfig(({ command }) => ({
	server: {
		// allow dev server access through Cloudflare quick tunnel
		allowedHosts: command === 'serve' ? ['.trycloudflare.com'] : [],
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
			},
			// Pinned so every build pass derives the same __sveltekit_<hash> global.
			// The Date.now() default can differ between passes and breaks hydration.
			version: {
				name: process.env.GITHUB_SHA ?? 'dev'
			}
		})
	],
	test: {
		include: ['src/**/*.spec.ts']
	}
}));
