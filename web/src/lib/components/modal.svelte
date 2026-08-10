<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';

	interface Props {
		open: boolean;
		title: string;
		children: Snippet;
		onclose: () => void;
		class?: string;
	}

	const { open, title, children, onclose, class: className }: Props = $props();
</script>

<Dialog.Root {open} onOpenChange={(next) => !next && onclose()}>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isOpen })}
				{#if isOpen}
					<div
						{...props}
						class="fixed inset-0 z-100 bg-black/25"
						transition:fade={{ duration: 150 }}
					></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>

		<Dialog.Content forceMount>
			{#snippet child({ props, open: isOpen })}
				{#if isOpen}
					<div
						{...props}
						class={[
							'fixed top-1/2 left-1/2 z-100 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-125 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto bg-white p-6 shadow-xl md:p-8',
							className
						]}
						transition:fade={{ duration: 150 }}
					>
						<Dialog.Close
							aria-label="Close"
							class="absolute top-1 right-1 cursor-pointer p-1 text-purple-5"
						>
							<Close size={16} />
						</Dialog.Close>

						<Dialog.Title class="b2 font-bold">{title}</Dialog.Title>

						{@render children()}
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
