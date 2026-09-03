<script lang="ts">
	import { resolve } from '$app/paths';
	import Accordion from '$lib/components/accordion.svelte';
	import Button from '$lib/components/button.svelte';
	import IndicatorDetail from '$lib/components/assessment/indicator-detail.svelte';
	import { chambers, type Chamber } from '$lib/constants/chambers';
	import type { Answer } from '$lib/data/answers';
	import type { Country } from '$lib/data/countries';
	import type { IndicatorContext } from '$lib/data/indicator-contexts';
	import type { Question } from '$lib/data/questions';
	import { quickFade } from '$lib/utils/transitions';

	interface Props {
		country: Country;
		questions: Question[];
		answers: Answer[];
		contexts: IndicatorContext[];
		class?: string;
	}

	const { country, questions, answers, contexts, class: className }: Props = $props();

	let open = $state(false);
	let chamber = $state<Chamber>();

	const chamberScores = $derived(
		chambers
			.map((value) => ({
				chamber: value,
				answers: answers.filter((answer) => answer.chamber === value)
			}))
			.map(({ chamber: value, answers: chamberAnswers }) => ({
				chamber: value,
				hasAnswers: chamberAnswers.length > 0,
				score: chamberAnswers.reduce((sum, { score }) => sum + score, 0),
				totalApplicableScore: chamberAnswers.reduce(
					(sum, { totalApplicableScore }) => sum + totalApplicableScore,
					0
				)
			}))
	);

	const assessedChambers = $derived(chamberScores.filter(({ hasAnswers }) => hasAnswers));
	const selectedChamber = $derived(chamber ?? assessedChambers[0]?.chamber);

	const selectChamber = (value: Chamber) => {
		if (assessedChambers.length < 2) {
			open = !open;
			return;
		}

		chamber = value;
		open = true;
	};
</script>

{#snippet chamberScore({
	chamber: value,
	score,
	totalApplicableScore
}: (typeof chamberScores)[number])}
	<span class="b5 text-gray-8 md:text-nowrap">{value} chamber</span>
	{#if totalApplicableScore > 0}
		<span class="flex flex-row flex-wrap font-mono">
			<span class="font-bold">{score.toFixed(2)}</span>
			<span class="text-gray-6">/{totalApplicableScore.toFixed(2)}</span>
		</span>
	{:else}
		<span class="font-bold text-gray-4">N/A</span>
	{/if}
{/snippet}

<Accordion
	bind:open
	class="bg-white {className ?? ''}"
	headerClass="p-4 md:px-6 md:py-5"
	contentClass="p-4 pt-0 md:px-6 md:pb-6"
>
	{#snippet header()}
		<h3 class="text-left b2 font-bold">{country.name}</h3>
	{/snippet}

	{#snippet trailing()}
		<div class="flex flex-row items-center">
			{#each chamberScores as score (score.chamber)}
				{#if !score.hasAnswers}
					<div class="invisible flex flex-1 flex-col gap-0.5 p-2 md:px-4" aria-hidden="true">
						{@render chamberScore(score)}
					</div>
				{:else}
					<button
						type="button"
						class={[
							'flex flex-1 cursor-pointer flex-col gap-0.5 p-2 text-left transition-colors md:px-4',
							open && score.chamber === selectedChamber ? 'bg-gray-2' : 'hover:bg-gray-1'
						]}
						onclick={() => selectChamber(score.chamber)}
					>
						{@render chamberScore(score)}
					</button>
				{/if}
			{/each}
		</div>
	{/snippet}

	{#snippet content()}
		<div in:quickFade class="flex flex-1 flex-col gap-4">
			<IndicatorDetail
				{questions}
				answers={answers.filter((answer) => answer.chamber === selectedChamber)}
				context={contexts.find(({ chamber: value }) => value === selectedChamber)}
				class="border-t-4 border-black pt-4"
			/>

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
