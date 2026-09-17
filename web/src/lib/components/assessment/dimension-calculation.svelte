<script lang="ts">
	import type { Dimension } from '$lib/constants/dimensions';

	interface Props {
		dimension: Dimension;
		indicatorCount: number;
		class?: string;
	}

	const { dimension, indicatorCount, class: className }: Props = $props();
</script>

<p class={['border-l-2 border-gray-4 pl-2 b4 text-gray-6', className]}>
	<strong>Calculation:</strong>
	{dimension} contributes one-third of the overall score. This dimension consists of {indicatorCount}
	indicators, each contributing a different number of raw scores. The total raw score is converted to
	a percentage.
</p>
