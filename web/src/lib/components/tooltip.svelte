<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tooltip } from 'bits-ui';

	interface Props {
		trigger: Snippet;
		children: Snippet;
		side?: Tooltip.ContentProps['side'];
		triggerClass?: string;
		class?: string;
	}

	const { trigger, children, side = 'bottom', triggerClass, class: className }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={150}>
		<Tooltip.Trigger
			type="button"
			class={['inline-flex cursor-help items-center gap-1', triggerClass]}
		>
			{@render trigger()}
		</Tooltip.Trigger>

		<Tooltip.Portal>
			<Tooltip.Content {side} sideOffset={4} collisionPadding={8}>
				<div
					class={[
						'max-w-70 border border-gray-1 bg-white p-4 text-left b4 text-black shadow-lg',
						className
					]}
				>
					{@render children()}
				</div>
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
