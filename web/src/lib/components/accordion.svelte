<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';

	interface Props {
		header: Snippet;
		content: Snippet;
		leading?: Snippet;
		headerClass?: string;
		contentClass?: string;
		iconClass?: string;
		class?: string;
	}

	const {
		header,
		content,
		leading,
		headerClass,
		contentClass,
		iconClass = 'text-purple-5',
		class: className
	}: Props = $props();

	let open = $state(false);

	const contentId = $props.id();
</script>

<div class={['flex flex-col', className]}>
	<button
		class={['flex cursor-pointer flex-row gap-1 transition-colors', headerClass]}
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

	{#if open}
		<div
			id={contentId}
			class={['flex flex-row', contentClass]}
			transition:slide={{ duration: 150 }}
		>
			{@render content()}
		</div>
	{/if}
</div>
