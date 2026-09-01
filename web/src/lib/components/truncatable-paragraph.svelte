<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { Snippet } from 'svelte';
	import Hyperlink from './hyperlink.svelte';

	interface Props {
		children: Snippet;
		maxLines?: number;
		class?: string;
	}

	const { children, maxLines = 3, class: className }: Props = $props();

	let isExpanded = $state(false);
	let isTruncatable = $state(false);

	const measureOverflow: Attachment<HTMLParagraphElement> = (paragraph) => {
		const observer = new ResizeObserver(() => {
			if (!isExpanded) {
				isTruncatable = paragraph.scrollHeight > paragraph.clientHeight;
			}
		});

		observer.observe(paragraph);

		return () => observer.disconnect();
	};
</script>

<div class="flex flex-col items-start">
	<p
		class={[className, !isExpanded && 'line-clamp-(--max-lines)']}
		style="--max-lines: {maxLines}"
		{@attach measureOverflow}
	>
		{@render children()}
	</p>
	{#if isTruncatable}
		<Hyperlink class="b4" onclick={() => (isExpanded = !isExpanded)}>
			{isExpanded ? 'See less' : 'See more'}
		</Hyperlink>
	{/if}
</div>
