<script lang="ts">
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { resolve } from '$app/paths';
	import Accordion from '$lib/components/accordion.svelte';
	import Button from '$lib/components/button.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import IndicatorDetail from '$lib/components/assessment/indicator-detail.svelte';
	import type { AchievementLevel } from '$lib/constants/achievements';
	import { getAchievementLevel, type Answer } from '$lib/data/answers';
	import type { IndicatorContext } from '$lib/data/indicator-contexts';
	import type { Indicator } from '$lib/data/indicators';
	import type { Question } from '$lib/data/questions';

	interface Props {
		indicator: Indicator;
		questions: Question[];
		answers: Answer[];
		achievedCountryCount: number;
		context?: IndicatorContext;
		class?: string;
	}

	const {
		indicator,
		questions,
		answers,
		achievedCountryCount,
		context,
		class: className
	}: Props = $props();

	const indicatorHref = $derived(
		resolve('/indicators/[number]', { number: `${indicator.number}` })
	);

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
	toggleClass="p-4 hover:bg-gray-2 md:p-6"
	contentClass="border-t-4 border-black p-4 md:px-6 md:pb-6"
>
	{#snippet header()}
		<div class="flex flex-col text-left">
			<h3 class="b2 font-bold">{indicator.name}</h3>
			<p class="b4 text-gray-6">
				<span class="font-mono">{questions.length}</span>
				{questions.length === 1 ? 'question' : 'questions'}
			</p>
		</div>
	{/snippet}

	{#snippet trailing()}
		<div class="flex flex-col gap-2 px-4 pb-4 md:items-end md:p-6">
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

			<Hyperlink href={indicatorHref} class="b4">
				<span class="font-mono">{achievedCountryCount}</span>
				{achievedCountryCount === 1 ? 'country' : 'countries'} achieved
				{#snippet icon()}
					<ChevronRight size={16} class="-mx-1" />
				{/snippet}
			</Hyperlink>
		</div>
	{/snippet}

	{#snippet content()}
		<div class="flex flex-1 flex-col gap-4">
			<IndicatorDetail {questions} {answers} {context} />

			<Button href={indicatorHref} variant="secondary" class="self-end">
				Explore this indicator
			</Button>
		</div>
	{/snippet}
</Accordion>
