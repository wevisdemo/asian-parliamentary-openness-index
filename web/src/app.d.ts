// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			glossary: import('$lib/data/glossary').GlossaryTerm[];
			cycle: import('$lib/data/cycle').Cycle;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '*.zip?url' {
	const url: string;
	export default url;
}

declare module '*.csv?raw' {
	const content: string;
	export default content;
}

export {};
