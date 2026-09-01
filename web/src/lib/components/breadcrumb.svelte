<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { page } from '$app/state';
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

{#snippet chevron()}
	<ChevronRight />
{/snippet}

<nav aria-label="Breadcrumb" class={['flex flex-row flex-wrap items-center gap-1', className]}>
	{#each items as { label, href }, index (href)}
		{@const hasNext = index < items.length - 1 || Boolean(trailing)}
		{#if page.url.pathname === href}
			<span aria-current="page" class="b4">{label}</span>
			{#if hasNext}
				{@render chevron()}
			{/if}
		{:else}
			<Hyperlink {href} icon={hasNext ? chevron : undefined}>{label}</Hyperlink>
		{/if}
	{/each}

	{@render trailing?.()}
</nav>
