<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { Snippet } from 'svelte';
	import Hyperlink from './hyperlink.svelte';

	interface Props {
		children: Snippet;
		maxLength?: number;
		class?: string;
	}

	const { children, maxLength = 200, class: className }: Props = $props();

	let fullText = $state('');
	let isExpanded = $state(false);

	const isTruncatable = $derived(fullText.length > maxLength);
	const isTruncated = $derived(isTruncatable && !isExpanded);

	const measureText: Attachment<HTMLParagraphElement> = (paragraph) => {
		fullText = paragraph.textContent ?? '';
	};
</script>

<p class={className} {@attach measureText}>
	{#if isTruncated}
		{`${fullText.slice(0, maxLength).trimEnd()}…`}
	{:else}
		{@render children()}
	{/if}
	{#if isTruncatable}
		<Hyperlink class="ml-1" onclick={() => (isExpanded = !isExpanded)}>
			{isExpanded ? 'See less' : 'See more'}
		</Hyperlink>
	{/if}
</p>
