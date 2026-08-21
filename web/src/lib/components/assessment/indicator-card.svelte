<script lang="ts">
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { resolve } from '$app/paths';
	import AchievementBar from '$lib/components/assessment/achievement-bar.svelte';
	import type { AchievementLevel } from '$lib/constants/achievements';
	import { quickFade } from '$lib/utils/transitions';
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
</script>

<a
	in:quickFade
	href={resolve('/indicators/[number]', { number: `${indicator.number}` })}
	class={[
		'relative flex flex-col gap-4 bg-white p-4 transition-colors hover:bg-gray-2 md:flex-row md:p-6',
		className
	]}
>
	<div class="flex flex-1 flex-col pr-8 md:pr-0">
		<h3 class="b2 font-bold">{indicator.name}</h3>
		<p class="b4 text-gray-6">
			<span class="font-mono">{questionCount}</span>
			{questionCount === 1 ? 'Question' : 'Questions'}
		</p>
	</div>

	<div class="flex flex-1 flex-col gap-4 md:flex-row-reverse md:pt-1">
		<p class="flex w-20 flex-row items-end gap-1 md:flex-col md:text-right">
			<span class="font-mono b2 leading-none font-bold text-data-achieved"
				>{achievedPercentage.toFixed(2)}%</span
			>
			<span class="b4">achieved</span>
		</p>
		<AchievementBar {countryCountByLevel} class="flex-1" />
	</div>

	<ChevronRight size={20} class="absolute top-4 right-4 shrink-0 text-gray-4 md:static md:ml-2" />
</a>
