<script lang="ts">
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { achievementLevelColorClasses } from '$lib/constants/achievements';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const levels = ['Achieved', 'Partly achieved', 'Not achieved', 'N/A'] as const;

	const swatchLevels = levels.filter((level) => level !== 'N/A');

	const levelDescriptions: Record<(typeof levels)[number], string> = {
		Achieved:
			'All questions within the indicator receive a full score across all chambers, excluding those that are not applicable to the country context.',
		'Partly achieved':
			'At least one question within the indicator does not receive a full score, excluding those that are not applicable to the country context.',
		'Not achieved':
			'All questions within the indicator receive a score of 0 across all chambers, excluding those that are not applicable to the country context.',
		'N/A':
			'All questions within the indicator are not applicable to the country context across all chambers.'
	};
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
					<dd class="inline">{levelDescriptions[level]}</dd>
				</div>
			{/each}
		</dl>
	</Tooltip>
</div>
