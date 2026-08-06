<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';

	interface Props {
		open: boolean;
		title: string;
		children: Snippet;
		onclose: () => void;
		class?: string;
	}

	const { open, title, children, onclose, class: className }: Props = $props();

	const titleId = $props.id();
</script>

<svelte:window onkeydown={({ key }) => open && key === 'Escape' && onclose()} />

{#if open}
	<div
		class="fixed inset-0 z-100 flex items-center justify-center p-4 shadow-xl"
		transition:fade={{ duration: 150 }}
	>
		<button type="button" aria-label="Close" class="absolute inset-0 bg-black/25" onclick={onclose}
		></button>

		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			class={['relative flex w-full max-w-125 flex-col gap-4 bg-white p-6 md:p-8', className]}
		>
			<button
				type="button"
				aria-label="Close"
				class="absolute top-1 right-1 cursor-pointer p-1 text-purple-5"
				onclick={onclose}
			>
				<Close size={16} />
			</button>

			<h2 id={titleId} class="b2 font-bold">{title}</h2>

			{@render children()}
		</div>
	</div>
{/if}
