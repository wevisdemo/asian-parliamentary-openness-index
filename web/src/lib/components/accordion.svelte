<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';

	interface Props {
		header: Snippet;
		content: Snippet;
		headerClass?: string;
		class?: string;
	}

	const { header, content, headerClass, class: className }: Props = $props();

	let open = $state(false);

	const contentId = $props.id();
</script>

<div class={['flex flex-col', className]}>
	<button
		class={['flex cursor-pointer flex-row gap-1 p-4 transition-colors md:p-6', headerClass]}
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
		<div
			id={contentId}
			class="flex flex-row p-4 pt-0 md:px-6 md:pb-6"
			transition:slide={{ duration: 150 }}
		>
			{@render content()}
		</div>
	{/if}
</div>
