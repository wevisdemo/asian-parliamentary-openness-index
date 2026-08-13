<script lang="ts">
	import { tick } from 'svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import { dimensionOptions, type Dimension } from '$lib/constants/dimensions';

	interface Props {
		value: Dimension;
		onselect: (dimension: Dimension) => void;
		class?: string;
	}

	const { value, onselect, class: className }: Props = $props();

	let element = $state<HTMLElement>();

	/**
	 * Scrolls the content right after the tabs to the top, below the sticky tabs themselves.
	 * The tabs cannot be measured directly, as a stuck element always reports the stuck position.
	 */
	export const scrollToContent = async () => {
		await tick();

		const content = element?.nextElementSibling;

		if (!element || !content) return;

		const stickyOffset = parseFloat(getComputedStyle(element).top) || 0;
		const contentGap = element.parentElement
			? parseFloat(getComputedStyle(element.parentElement).rowGap) || 0
			: 0;

		window.scrollTo({
			top:
				content.getBoundingClientRect().top +
				window.scrollY -
				element.offsetHeight -
				contentGap -
				stickyOffset,
			behavior: 'smooth'
		});
	};
</script>

<div
	bind:this={element}
	class={[
		'sticky top-12 z-40 -mx-5 flex flex-1 overflow-x-scroll px-5 md:top-16 md:mx-0 md:overflow-visible md:px-0',
		className
	]}
>
	<Tabs
		class="flex-1 whitespace-nowrap"
		options={dimensionOptions}
		{value}
		variant="secondary"
		{onselect}
	/>
</div>
