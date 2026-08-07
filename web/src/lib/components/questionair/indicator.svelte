<script lang="ts">
	import Accordion from '$lib/components/accordion.svelte';
	import QuestionAnswer from '$lib/components/questionair/question-answer.svelte';
	import type { Answer } from '$lib/data/answers';
	import type { Indicator } from '$lib/data/indicators';
	import type { Question } from '$lib/data/questions';

	interface Props {
		indicator: Indicator;
		questions: Question[];
		answers: Answer[];
		class?: string;
	}

	const { indicator, questions, answers, class: className }: Props = $props();

	const statusClasses = {
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

	const status: keyof typeof statusClasses = $derived.by(() => {
		const applicable = indicatorAnswers.filter(
			({ totalApplicableScore }) => totalApplicableScore > 0
		);

		if (!applicable.length) return 'N/A';

		const achieved = applicable.filter(
			({ score, totalApplicableScore }) => score === totalApplicableScore
		);

		if (!achieved.length) return 'Not achieved';

		return achieved.length === applicable.length ? 'Achieved' : 'Partly achieved';
	});
</script>

<Accordion class={className}>
	{#snippet header()}
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div class="flex flex-col text-left">
				<h3 class="b2 font-bold">{indicator.name}</h3>
				<p class="b4 text-gray-6">
					{questions.length}
					{questions.length === 1 ? 'Question' : 'Questions'}
				</p>
			</div>

			<div class="flex flex-row items-center justify-between gap-4">
				<span class={['px-2 py-1 b4 font-bold whitespace-nowrap', statusClasses[status]]}
					>{status}</span
				>
				<p class="b2 whitespace-nowrap">
					<span class="font-bold">{score}</span><span class="text-gray-6"
						>/{totalApplicableScore}</span
					>
				</p>
			</div>
		</div>
	{/snippet}

	{#snippet content()}
		<div class="mt-5 flex flex-col gap-4 border-t-4 border-black pt-4 md:mt-6">
			{#each questions as question, index (question.number)}
				<QuestionAnswer
					{question}
					answer={answerOf(question)}
					class={index > 0 ? 'border-t-2 border-gray-2 pt-4' : undefined}
				/>
			{/each}
		</div>
	{/snippet}
</Accordion>
