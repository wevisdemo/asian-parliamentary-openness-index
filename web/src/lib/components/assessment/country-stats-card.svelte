<script lang="ts">
	import type { ChamberScope } from '$lib/constants/chambers';
	import type { getDimensionScores } from '$lib/data/scores';

	interface Props {
		chamber: ChamberScope;
		score: number;
		dimensionScores: ReturnType<typeof getDimensionScores>;
		class?: string;
	}

	const { chamber, score, dimensionScores, class: className }: Props = $props();

	const scoredDimensionCount = $derived(
		dimensionScores.filter(({ score: dimensionScore }) => dimensionScore !== undefined).length
	);
</script>

<div class={['flex flex-col gap-5 bg-black p-7 text-white', className]}>
	<div class="flex flex-col items-center gap-2 text-center">
		<h2 class="b3 font-bold">{chamber === 'Both' ? 'Aggregated score' : `${chamber} chamber`}</h2>
		<p class="b5 text-gray-6">
			{chamber === 'Both' ? 'Across both chambers' : `Across ${scoredDimensionCount} dimensions`}
		</p>
		<p class="h4 font-bold">{score.toFixed(2)}%</p>
	</div>

	<dl class="flex flex-col gap-4">
		{#each dimensionScores as { dimension, score: dimensionScore } (dimension)}
			<div class="grid grid-cols-[1fr_auto] items-end gap-x-2 gap-y-1.5">
				<dt class="b4 text-gray-4">{dimension}</dt>
				<dd class="font-mono b5 font-bold">
					{dimensionScore === undefined ? 'N/A' : `${dimensionScore.toFixed(2)}%`}
				</dd>
				<dd aria-hidden="true" class="col-span-2 h-3 bg-gray-10">
					<div class="h-full bg-white" style="width: {dimensionScore ?? 0}%"></div>
				</dd>
			</div>
		{/each}
	</dl>
</div>
