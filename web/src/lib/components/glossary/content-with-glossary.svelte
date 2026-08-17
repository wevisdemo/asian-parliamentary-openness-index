<script lang="ts">
	import { page } from '$app/state';
	import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
	import { getGlossaryState } from '$lib/components/glossary/glossary-state.svelte';
	import { splitContentByTerm } from '$lib/data/glossary';

	interface Props {
		content: string;
	}

	const { content }: Props = $props();

	const glossaryState = getGlossaryState();

	const segments = $derived(splitContentByTerm(content, page.data.glossary));
</script>

{#each segments as { text, isTerm }, index (index)}{#if isTerm}<button
			type="button"
			class="cursor-pointer text-purple-5 hover:underline"
			onclick={() => glossaryState.open(text)}
			>{text}<Bookmark size={16} class="mb-0.5 ml-0.5 inline" /></button
		>{:else}{text}{/if}{/each}
