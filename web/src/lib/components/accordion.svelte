<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';
	import { quickSlide } from '$lib/utils/transitions';

	interface Props {
		header: Snippet;
		content: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
		open?: boolean;
		headerClass?: string;
		toggleClass?: string;
		contentClass?: string;
		iconClass?: string;
		class?: string;
	}

	let {
		header,
		content,
		leading,
		trailing,
		open = $bindable(false),
		headerClass,
		toggleClass,
		contentClass,
		iconClass = 'text-purple-5',
		class: className
	}: Props = $props();

	const contentId = $props.id();
</script>

{#snippet toggle(extraClass?: ClassValue)}
	<button
		class={['flex cursor-pointer flex-row gap-1 transition-colors', extraClass]}
		type="button"
		aria-expanded={open}
		aria-controls={contentId}
		onclick={() => (open = !open)}
	>
		{@render leading?.()}

		<div class="flex flex-row items-start gap-3 text-left">
			<span class={['shrink-0', iconClass]}>
				{#if open}
					<Subtract size={24} class="size-5 md:size-6" />
				{:else}
					<Add size={24} class="size-5 md:size-6" />
				{/if}
			</span>
		</div>
		<span class="flex-1">{@render header()}</span>
	</button>
{/snippet}

<div class={['flex flex-col', className]}>
	{#if trailing}
		<div class={['flex flex-col md:flex-row md:items-stretch', headerClass]}>
			{@render toggle(['flex-1 self-stretch', toggleClass])}
			{@render trailing()}
		</div>
	{:else}
		{@render toggle([headerClass, toggleClass])}
	{/if}

	{#if open}
		<div id={contentId} class={['flex flex-row', contentClass]} transition:quickSlide>
			{@render content()}
		</div>
	{/if}
</div>
