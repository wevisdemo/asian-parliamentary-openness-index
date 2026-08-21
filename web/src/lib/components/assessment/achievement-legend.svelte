<script lang="ts">
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import {
		achievementLevelColorClasses,
		achievementLevelDescriptions,
		achievementLevels,
		type AchievementLevel
	} from '$lib/constants/achievements';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const levels: AchievementLevel[] = [
		...achievementLevels.filter((level) => level !== 'N/A').toReversed(),
		'N/A'
	];

	const swatchLevels = levels.filter((level) => level !== 'N/A');
</script>

<div class={['flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-gray-8', className]}>
	{#each swatchLevels as level (level)}
		<span class="flex flex-row items-center gap-1 whitespace-nowrap">
			<span class={['size-3 border border-gray-8', achievementLevelColorClasses[level]]}></span>
			<span>{level}</span>
		</span>
	{/each}

	<Tooltip triggerClass="text-gray-6">
		{#snippet trigger()}
			<Information size={16} />
		{/snippet}

		<dl class="flex flex-col gap-3">
			{#each levels as level (level)}
				<div class={[level === 'N/A' && 'text-gray-6']}>
					<dt class="inline font-bold">{level}:</dt>
					<dd class="inline">{achievementLevelDescriptions[level]}</dd>
				</div>
			{/each}
		</dl>
	</Tooltip>
</div>
