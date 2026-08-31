<script lang="ts">
	import Tabs from '$lib/components/tabs.svelte';
	import { dimensionOptions, type Dimension } from '$lib/constants/dimensions';

	interface Props {
		id?: string;
		value: Dimension;
		onselect: (dimension: Dimension) => void;
		class?: string;
	}

	const { id, value, onselect, class: className }: Props = $props();

	let tabs = $state<ReturnType<typeof Tabs<Dimension>>>();

	export const scrollToContent = () => tabs?.scrollToContent();
</script>

<Tabs
	bind:this={tabs}
	{id}
	options={dimensionOptions}
	{value}
	variant="secondary"
	sticky
	{onselect}
	class={className}
/>
