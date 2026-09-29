<script lang="ts">
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';

	interface Props {
		done: boolean;
	}

	const { done }: Props = $props();
</script>

{#if done}
	<CheckmarkFilled size={16} class="shrink-0 text-purple-5" aria-label="Answered" />
{:else}
	<CircleDash size={16} class="shrink-0 text-gray-5" aria-label="Not answered" />
{/if}
