<script lang="ts">
	import type { Snippet } from 'svelte';
	import { quickFade } from '$lib/utils/transitions';

	interface Props {
		name?: string;
		postfix?: string;
		description?: string;
		children: Snippet;
		class?: string;
	}

	const { name, postfix, description, children, class: className }: Props = $props();
</script>

<div in:quickFade class={['flex flex-col gap-4', className]}>
	{#if name}
		<div class="flex flex-col border-t-2 border-gray-6 pt-4 b4 text-gray-6">
			<h4>
				<span class="font-bold text-gray-8">{name}</span>
				{#if postfix}
					<span>{postfix}</span>
				{/if}
			</h4>
			{#if description}
				<p>{description}</p>
			{/if}
		</div>
	{/if}

	{@render children()}
</div>
