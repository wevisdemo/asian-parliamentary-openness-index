<script lang="ts">
	import Accordion from '$lib/components/accordion.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import QuestionAnswer from '$lib/components/questionair/question-answer.svelte';
	import type { AchievementLevel } from '$lib/constants/achievements';
	import { getAchievementLevel, type Answer } from '$lib/data/answers';
	import type { IndicatorContext } from '$lib/data/indicator-contexts';
	import type { Indicator } from '$lib/data/indicators';
	import type { Question } from '$lib/data/questions';

	interface Props {
		indicator: Indicator;
		questions: Question[];
		answers: Answer[];
		context?: IndicatorContext;
		class?: string;
	}

	const { indicator, questions, answers, context, class: className }: Props = $props();

	const statusClasses: Record<AchievementLevel, string> = {
		'N/A': 'bg-data-na',
		'Not achieved': 'bg-data-not-achieved',
		'Partly achieved': 'bg-data-partly-achieved',
		Achieved: 'bg-data-achieved'
	};

	const answerOf = (question: Question) =>
		answers.find(({ questionNumber }) => questionNumber === question.number);

	const indicatorAnswers = $derived(
		questions.map(answerOf).filter((answer) => answer !== undefined)
	);

	const score = $derived(indicatorAnswers.reduce((sum, { score }) => sum + score, 0));

	const totalApplicableScore = $derived(
		indicatorAnswers.reduce((sum, { totalApplicableScore }) => sum + totalApplicableScore, 0)
	);

	const status = $derived(getAchievementLevel(indicatorAnswers));
</script>

<Accordion
	class="bg-white {className ?? ''}"
	headerClass="p-4 hover:bg-gray-2 md:p-6"
	contentClass="p-4 pt-0 md:px-6 md:pb-6"
>
	{#snippet header()}
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div class="flex flex-col text-left">
				<h3 class="b2 font-bold">{indicator.name}</h3>
				<p class="b4 text-gray-6">
					<span class="font-mono">{questions.length}</span>
					{questions.length === 1 ? 'Question' : 'Questions'}
				</p>
			</div>

			<div class="flex flex-row items-center justify-between gap-4">
				<span class={['px-2 py-1 b4 font-bold whitespace-nowrap', statusClasses[status]]}
					>{status}</span
				>
				<p class="font-mono b2 whitespace-nowrap">
					<span class="font-bold">{score.toFixed(2)}</span><span class="text-gray-6"
						>/{totalApplicableScore.toFixed(2)}</span
					>
				</p>
			</div>
		</div>
	{/snippet}

	{#snippet content()}
		<div class="flex flex-1 flex-col gap-4 border-t-4 border-black pt-4">
			{#each questions as question, index (question.number)}
				<QuestionAnswer
					{question}
					answer={answerOf(question)}
					class={index > 0 ? 'border-t-2 border-gray-2 pt-4' : undefined}
				/>
			{/each}

			<div class="flex flex-col gap-2">
				{#if context?.context}
					<Accordion
						class="bg-purple-1"
						headerClass="p-4 hover:bg-purple-2 md:p-6"
						contentClass="p-4 pt-0 md:px-6 md:pb-6"
					>
						{#snippet header()}
							<h4 class="text-left b4 font-bold">Country context</h4>
						{/snippet}

						{#snippet content()}
							<p class="ml-7 flex-1 whitespace-pre-line md:mt-2">{context.context}</p>
						{/snippet}
					</Accordion>
				{/if}

				{#if context?.evidences.length}
					<Accordion
						class="bg-purple-1"
						headerClass="p-4 hover:bg-purple-2 md:p-6"
						contentClass="p-4 pt-0 md:px-6 md:pb-6"
					>
						{#snippet header()}
							<h4 class="text-left b4 font-bold">Evidence sources</h4>
						{/snippet}

						{#snippet content()}
							<ul class="ml-7 flex flex-1 list-disc flex-col gap-1 pl-4 marker:text-gray-6 md:mt-2">
								{#each context.evidences as evidence (evidence)}
									<li>
										<Hyperlink
											href={evidence}
											target="_blank"
											color="gray"
											class="b4 break-all underline"
										>
											{evidence}
										</Hyperlink>
									</li>
								{/each}
							</ul>
						{/snippet}
					</Accordion>
				{/if}
			</div>
		</div>
	{/snippet}
</Accordion>
