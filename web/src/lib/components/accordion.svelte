<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';

	interface Props {
		header: Snippet;
		content: Snippet;
		class?: string;
	}

	const { header, content, class: className }: Props = $props();

	let open = $state(false);

	const contentId = $props.id();
</script>

<div class={['flex flex-col bg-white p-4 md:p-6', className]}>
	<button
		class="flex cursor-pointer flex-row gap-1"
		type="button"
		aria-expanded={open}
		aria-controls={contentId}
		onclick={() => (open = !open)}
	>
		<div class="flex flex-row items-start gap-3 text-left">
			<span class="shrink-0 text-purple-5">
				{#if open}
					<Subtract size={24} />
				{:else}
					<Add size={24} />
				{/if}
			</span>
		</div>
		<span class="flex-1">{@render header()}</span>
	</button>

	{#if open}
		<div id={contentId} class="flex flex-row" transition:slide={{ duration: 150 }}>
			{@render content()}
		</div>
	{/if}
</div>
