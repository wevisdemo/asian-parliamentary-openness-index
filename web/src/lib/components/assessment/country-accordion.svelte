<script lang="ts">
	import { resolve } from '$app/paths';
	import Accordion from '$lib/components/accordion.svelte';
	import Button from '$lib/components/button.svelte';
	import IndicatorDetail from '$lib/components/assessment/indicator-detail.svelte';
	import { getScoreTotals, type Answer } from '$lib/data/answers';
	import type { Country } from '$lib/data/countries';
	import type { Question } from '$lib/data/questions';
	import { quickFade } from '$lib/utils/transitions';

	interface Props {
		country: Country;
		questions: Question[];
		answers: Answer[];
		class?: string;
	}

	const { country, questions, answers, class: className }: Props = $props();

	const { score, totalApplicableScore } = $derived(getScoreTotals(answers));
</script>

<Accordion
	class="bg-white {className ?? ''}"
	headerClass="p-4 hover:bg-gray-2 md:p-6"
	contentClass="border-t-4 border-black p-4 md:px-6 md:pb-6"
>
	{#snippet header()}
		<span class="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-1 b2">
			<h3 class="text-left font-bold">{country.name}</h3>
			{#if totalApplicableScore > 0}
				<span class="flex flex-row flex-wrap font-mono">
					<span class="font-bold">{score.toFixed(2)}</span>
					<span class="text-gray-6">/{totalApplicableScore.toFixed(2)}</span>
				</span>
			{:else}
				<span class="font-bold text-gray-4">N/A</span>
			{/if}
		</span>
	{/snippet}

	{#snippet content()}
		<div in:quickFade class="flex flex-1 flex-col gap-4">
			<IndicatorDetail {questions} {answers} />

			<Button
				href={resolve('/countries/[country]', { country: country.slug })}
				variant="secondary"
				class="self-end"
			>
				Explore {country.name}
			</Button>
		</div>
	{/snippet}
</Accordion>
