<script lang="ts">
	import { achievementLevelColorClasses, type AchievementLevel } from '$lib/constants/achievements';

	interface Props {
		countryCountByLevel: Record<AchievementLevel, number>;
		variant?: 'compact' | 'loose';
		class?: string;
	}

	const { countryCountByLevel, variant = 'compact', class: className }: Props = $props();

	const isLoose = $derived(variant === 'loose');

	const barLevels: AchievementLevel[] = ['Achieved', 'Partly achieved', 'Not achieved'];

	const levelCounts = $derived(
		barLevels.map((level) => ({ level, count: countryCountByLevel[level] }))
	);
</script>

<div class={['flex flex-col gap-2', className]}>
	<div class="flex flex-row overflow-clip border border-gray-8" role="presentation">
		{#each levelCounts as { level, count } (level)}
			{#if count}
				<div
					class={[isLoose ? 'h-6' : 'h-3', achievementLevelColorClasses[level]]}
					style="flex-grow: {count}"
				></div>
			{/if}
		{/each}
	</div>

	<div
		class={['flex gap-x-3 gap-y-1 b5', isLoose ? 'flex-col' : 'flex-row flex-wrap items-center']}
	>
		<span class="text-gray-6">Number of countries</span>

		<div class="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
			{#each levelCounts as { level, count } (level)}
				<span class={['flex flex-row items-center gap-1', isLoose ? 'text-black' : 'text-gray-8']}>
					<span class={['size-3 border border-gray-8', achievementLevelColorClasses[level]]}></span>
					<span class={['font-mono', isLoose && 'font-bold']}>{count}</span>
					{#if isLoose}
						<span>{level}</span>
					{/if}
				</span>
			{/each}

			<span
				class={['flex items-center gap-1 text-gray-6', isLoose ? 'flex-row' : 'flex-row-reverse']}
			>
				<span class="font-mono">{countryCountByLevel['N/A']}</span>
				<span>N/A</span>
			</span>
		</div>
	</div>
</div>
