<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import Hyperlink from './hyperlink.svelte';

	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	interface Props {
		items: BreadcrumbItem[];
		trailing?: Snippet;
		class?: string;
	}

	const { items, trailing, class: className }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class={['flex flex-row flex-wrap items-center gap-2', className]}>
	{#each items as { label, href }, index (href)}
		{#if index > 0}
			<ChevronRight />
		{/if}
		<Hyperlink {href}>{label}</Hyperlink>
	{/each}

	{#if trailing}
		<ChevronRight />
		{@render trailing()}
	{/if}
</nav>
