<script lang="ts">
	import { page } from '$app/state';
	import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
	import { getGlossaryState } from '$lib/components/glossary/glossary-state.svelte';
	import { getTermAliases } from '$lib/data/glossary';

	interface Props {
		content: string;
	}

	const { content }: Props = $props();

	const glossaryState = getGlossaryState();

	const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const termPattern = $derived.by(() => {
		const patterns = page.data.glossary
			.flatMap(({ term }) => getTermAliases(term))
			.sort((a, b) => b.length - a.length)
			.map(escapeRegExp);

		return patterns.length ? new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi') : undefined;
	});

	/** Splits the content into plain text and glossary term segments, in reading order */
	const segments = $derived.by(() => {
		const matches = termPattern ? [...content.matchAll(termPattern)] : [];
		const endOf = (match: RegExpExecArray) => (match.index ?? 0) + match[0].length;

		const parts = matches.flatMap((match, index) => {
			const previous = matches[index - 1];

			return [
				{ text: content.slice(previous ? endOf(previous) : 0, match.index), isTerm: false },
				{ text: match[0], isTerm: true }
			];
		});

		const last = matches.at(-1);

		return [...parts, { text: content.slice(last ? endOf(last) : 0), isTerm: false }].filter(
			({ text }) => text
		);
	});
</script>

{#each segments as { text, isTerm }, index (index)}{#if isTerm}<button
			type="button"
			class="cursor-pointer text-purple-5 hover:underline"
			onclick={() => glossaryState.open(text)}
			>{text}<Bookmark size={16} class="mb-0.5 ml-0.5 inline" /></button
		>{:else}{text}{/if}{/each}
