<script lang="ts">
	import { achievementLevelColorClasses, type AchievementLevel } from '$lib/constants/achievements';
	import type { Indicator } from '$lib/data/indicators';

	interface Props {
		indicator: Indicator;
		questionCount: number;
		countryCountByLevel: Record<AchievementLevel, number>;
		achievedPercentage: number;
		class?: string;
	}

	const {
		indicator,
		questionCount,
		countryCountByLevel,
		achievedPercentage,
		class: className
	}: Props = $props();

	const barLevels: AchievementLevel[] = ['Achieved', 'Partly achieved', 'Not achieved', 'N/A'];

	const levelCounts = $derived(
		barLevels.map((level) => ({ level, count: countryCountByLevel[level] }))
	);
</script>

<div class={['flex flex-col gap-4 bg-white p-4 md:flex-row md:items-center md:p-6', className]}>
	<div class="flex flex-1 flex-col">
		<h3 class="b2 font-bold">{indicator.name}</h3>
		<p class="b4 text-gray-6">
			{questionCount}
			{questionCount === 1 ? 'Question' : 'Questions'}
		</p>
	</div>

	<div class="flex flex-1 flex-col gap-4 md:flex-row-reverse md:items-center">
		<p class="flex w-20 flex-row items-end gap-1 md:flex-col md:text-right">
			<span class="b2 leading-none font-bold text-data-achieved"
				>{achievedPercentage.toFixed(2)}%</span
			>
			<span class="b4">achieved</span>
		</p>
		<div class="flex flex-1 flex-col gap-2">
			<div class="flex flex-row overflow-clip border border-gray-8" role="presentation">
				{#each levelCounts as { level, count } (level)}
					{#if count}
						<div
							class={['h-3', achievementLevelColorClasses[level]]}
							style="flex-grow: {count}"
						></div>
					{/if}
				{/each}
			</div>
			<div class="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 b5 text-gray-6">
				<span>Number of countries</span>
				{#each levelCounts as { level, count } (level)}
					<span class="flex flex-row items-center gap-1">
						<span class={['size-3 border border-gray-8', achievementLevelColorClasses[level]]}
						></span>
						<span>{count}</span>
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>
