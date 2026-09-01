<script lang="ts">
	import type { Answer } from '$lib/data/answers';
	import type { Question } from '$lib/data/questions';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import { quickFade } from '$lib/utils/transitions';
	import ContentWithGlossary from '../glossary/content-with-glossary.svelte';
	import Tooltip from '../tooltip.svelte';

	interface Props {
		question: Question;
		answer?: Answer;
		class?: string;
	}

	const { question, answer, class: className }: Props = $props();

	const selectedOptions = $derived(answer?.answer ?? {});
</script>

<div class={['flex flex-col gap-2 md:flex-row md:gap-6', className]}>
	<div class="flex flex-3 flex-row gap-2 md:gap-3">
		<span class="font-mono font-bold">{question.number.split('.').at(-1)}</span>
		<p><ContentWithGlossary content={question.question} /></p>
	</div>

	{#key answer}
		<div in:quickFade class="flex flex-4 flex-col gap-2 md:flex-row md:gap-6">
			<ul class="flex flex-1 flex-col">
				{#each question.answerOptions as option (option.answer)}
					{@const optionState = selectedOptions[option.answer]}
					{@const isSelected = optionState === 'yes'}
					<li class={['flex flex-row gap-2', isSelected ? 'font-bold' : 'text-gray-6']}>
						<span aria-hidden="true">&bull;</span>
						<span class="flex-1">{option.text}</span>
						<span class={isSelected ? 'text-black' : undefined}>
							{#if answer?.answer && optionState !== 'n/a'}
								<span class="font-mono">{option.score.toFixed(2)}</span>
							{:else}
								<Tooltip>
									{#snippet trigger()}
										N/A
										<Information size={16} class="text-purple-3" />
									{/snippet}
									This option is not applicable to the country context.
								</Tooltip>
							{/if}</span
						>
					</li>
				{/each}
			</ul>

			{#if answer && answer.totalApplicableScore > 0}
				<p class="text-right font-mono b2 whitespace-nowrap">
					<span class="font-bold">{answer.score.toFixed(2)}</span><span class="text-gray-6"
						>/{answer.totalApplicableScore.toFixed(2)}</span
					>
				</p>
			{:else if answer}
				<p class="text-right font-mono b2 font-bold whitespace-nowrap text-gray-4 md:w-[9ch]">
					N/A
				</p>
			{/if}
		</div>
	{/key}
</div>
