<script lang="ts">
	import Accordion from '$lib/components/accordion.svelte';
	import IndicatorDetail from '$lib/components/questionair/indicator-detail.svelte';
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
		'N/A': 'text-gray-4',
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
				<span
					class={[
						'b4 font-bold whitespace-nowrap',
						status !== 'N/A' && 'px-2 py-1',
						statusClasses[status]
					]}>{status}</span
				>
				{#if status !== 'N/A'}
					<p class="font-mono b2 whitespace-nowrap">
						<span class="font-bold">{score.toFixed(2)}</span><span class="text-gray-6"
							>/{totalApplicableScore.toFixed(2)}</span
						>
					</p>
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet content()}
		<IndicatorDetail {questions} {answers} {context} class="border-t-4 border-black pt-4" />
	{/snippet}
</Accordion>
