<script lang="ts">
	import type { Answer } from '$lib/data/answers';
	import type { Question } from '$lib/data/questions';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
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
		<span class="font-mono font-bold text-gray-8">{question.number.split('.').at(-1)}</span>
		<p>{question.question}</p>
	</div>

	<div class="flex flex-4 flex-col gap-2 md:flex-row md:gap-6">
		<ul class="flex flex-1 flex-col">
			{#each question.answerOptions as option (option.answer)}
				{@const selectedOption = selectedOptions[option.answer]}
				<li class={['flex flex-row gap-2', selectedOption ? 'font-bold' : 'text-gray-6']}>
					<span aria-hidden="true">&bull;</span>
					<span class="flex-1">{option.text}</span>
					<span class={selectedOption ? 'text-black' : undefined}>
						{#if answer?.answer || (question.answerType === 'multiple' && selectedOption !== undefined)}
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

		{#if answer}
			<p class="text-right font-mono b2 whitespace-nowrap">
				<span class="font-bold">{answer.score.toFixed(2)}</span><span class="text-gray-6"
					>/{answer.totalApplicableScore.toFixed(2)}</span
				>
			</p>
		{/if}
	</div>
</div>
