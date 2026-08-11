<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tooltip } from 'bits-ui';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';

	interface Props {
		trigger: Snippet;
		children: Snippet;
		side?: Tooltip.ContentProps['side'];
		triggerClass?: string;
		class?: string;
	}

	const { trigger, children, side = 'bottom', triggerClass, class: className }: Props = $props();

	let open = $state(false);
</script>

<Tooltip.Provider>
	<Tooltip.Root bind:open delayDuration={150} disableCloseOnTriggerClick>
		<Tooltip.Trigger
			type="button"
			class={['inline-flex cursor-help items-center gap-1', triggerClass]}
			onclick={() => (open = true)}
		>
			{@render trigger()}
		</Tooltip.Trigger>

		<Tooltip.Portal>
			<Tooltip.Content {side} sideOffset={4} collisionPadding={8}>
				<div
					class={[
						'relative max-w-70 border border-gray-1 bg-white p-4 pr-8 text-left b4 text-black shadow-lg',
						className
					]}
				>
					<button
						type="button"
						aria-label="Close"
						class="absolute top-1 right-1 cursor-pointer p-1 text-purple-5"
						onclick={() => (open = false)}
					>
						<Close size={16} />
					</button>

					{@render children()}
				</div>
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
