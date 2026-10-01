<script lang="ts">
	import type { ChamberScope } from '$lib/constants/chambers';
	import type { getScoreTotals } from '$lib/data/answers';
	import type { getDimensionScores } from '$lib/data/scores';

	interface Props {
		chamber: ChamberScope;
		score: number;
		totals: ReturnType<typeof getScoreTotals>;
		dimensionScores: ReturnType<typeof getDimensionScores>;
		class?: string;
	}

	const { chamber, score, totals, dimensionScores, class: className }: Props = $props();
</script>

{#snippet rawScore({ score, totalApplicableScore }: ReturnType<typeof getScoreTotals>)}
	<span class="whitespace-nowrap text-gray-4">
		({score}<span class="text-gray-6">/{totalApplicableScore}</span>)
	</span>
{/snippet}

<div class={['flex flex-col gap-5 bg-black p-7 text-white', className]}>
	<div class="flex flex-col items-center text-center">
		<h2 class={[chamber === 'Both' ? 'b1' : 'b3', 'font-bold']}>
			{chamber === 'Both' ? 'Aggregated score' : `${chamber} chamber`}
		</h2>
		{#if chamber === 'Both'}
			<p class="b5 text-gray-6">Across both chambers</p>
		{/if}

		<p class="mt-3 h4 font-bold">{score.toFixed(2)}%</p>
		<p class="mt-1 b4">{@render rawScore(totals)}</p>
	</div>

	<dl class="flex flex-col gap-3">
		{#each dimensionScores as { dimension, score: dimensionScore, totals: dimensionTotals } (dimension)}
			<div class="grid grid-cols-[fit-content(100%)_1fr] items-end gap-x-2 gap-y-1.5">
				<dt class="b4 text-gray-4">{dimension}</dt>
				<dd class="flex flex-wrap justify-end gap-x-1 b5">
					<span class="font-mono font-bold">
						{dimensionScore === undefined ? 'N/A' : `${dimensionScore.toFixed(2)}%`}
					</span>
					{#if dimensionScore !== undefined}
						{@render rawScore(dimensionTotals)}
					{/if}
				</dd>
				<dd aria-hidden="true" class="col-span-2 h-3 bg-gray-10">
					<div class="h-full bg-white" style="width: {dimensionScore ?? 0}%"></div>
				</dd>
			</div>
		{/each}
	</dl>
</div>
