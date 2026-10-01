<script lang="ts">
	import { flip } from 'svelte/animate';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import { resolve } from '$app/paths';
	import Accordion from '$lib/components/accordion.svelte';
	import Button from '$lib/components/button.svelte';
	import Combobox from '$lib/components/combobox.svelte';
	import CountryContext from '$lib/components/assessment/country-context.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { chamberScopeOptions, type ChamberScope } from '$lib/constants/chambers';
	import { parliamentTypes, type ParliamentType } from '$lib/constants/parliament-types';
	import type { Country } from '$lib/data/countries';

	interface CountryScore {
		country: Country;
		chamberScores: Partial<Record<ChamberScope, number>>;
	}

	interface Props {
		scores: CountryScore[];
		scoreLabel: string;
		compare?: ChamberScope;
		highlighted?: string[];
		class?: string;
	}

	let {
		scores,
		scoreLabel,
		compare = $bindable('Lower'),
		highlighted = $bindable([]),
		class: className
	}: Props = $props();

	const compared = $derived(
		scores.map(({ country, chamberScores }) => ({
			country,
			score: chamberScores[compare]
		}))
	);

	const ranked = $derived(
		compared
			.filter((item): item is { country: Country; score: number } => item.score !== undefined)
			.toSorted((a, b) => b.score - a.score)
			.map((item, index, sorted) => ({
				...item,
				rank: sorted.findIndex(({ score }) => score === item.score) + 1 || index + 1
			}))
	);

	const average = $derived(
		ranked.length ? ranked.reduce((sum, { score }) => sum + score, 0) / ranked.length : 0
	);

	const rows = $derived([
		...[
			...ranked.map((item) => ({ key: item.country.slug, ...item })),
			{ key: 'average', country: undefined, rank: undefined, score: average }
		].toSorted((a, b) => b.score - a.score),
		...compared
			.filter(({ score }) => score === undefined)
			.map(({ country }) => ({ key: country.slug, country, rank: undefined, score: undefined }))
	]);

	const highlightOptions = $derived(
		scores
			.map(({ country }) => ({ label: country.name, value: country.slug }))
			.toSorted((a, b) => a.label.localeCompare(b.label))
	);

	const rankClass = 'w-6 shrink-0 self-start md:self-center text-left b4 md:w-8';
	const iconSpacerClass = 'w-5 shrink-0 md:w-6';
	const rowClass = 'flex flex-row gap-1';
	const rowPaddingClass = 'p-2 md:px-4';
	const headingPaddingClass = 'p-2 md:px-4';
</script>

{#snippet typeBadge(type: ParliamentType)}
	<span class="border border-current px-1 py-0.5 font-mono b5 leading-none font-normal"
		>{type[0]}</span
	>
{/snippet}

{#snippet scoreRow(
	label: string,
	score: number | undefined,
	type?: ParliamentType,
	isHighlighted?: boolean
)}
	<div
		class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-1 gap-y-2 text-left md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
	>
		<span class="col-start-1 row-start-1 flex min-w-0 flex-row items-center gap-2">
			{#if type}
				{@render typeBadge(type)}
			{/if}
			<span
				class={[
					'b4 font-bold',
					!type && 'text-purple-2',
					isHighlighted && 'text-data-partly-achieved'
				]}>{label}</span
			>
		</span>

		<div
			class="relative col-span-2 row-start-2 h-4 bg-gray-10 md:col-span-1 md:col-start-2 md:row-start-1 md:h-8"
		>
			<div
				class={[
					'h-full transition-[width,background-color] duration-300',
					!type ? 'bg-purple-2' : isHighlighted ? 'bg-data-partly-achieved' : 'bg-white'
				]}
				style="width: {score ?? 0}%"
			></div>
			{#if type && score !== undefined}
				<div
					class={[
						'absolute inset-y-0 -translate-x-px border-l-2 border-dashed transition-[left,border-color] duration-300',
						score > average ? 'border-purple-3' : 'border-purple-2'
					]}
					style="left: {average}%"
				></div>
			{/if}
		</div>

		<span
			class={[
				'col-start-2 row-start-1 text-right font-mono b4 md:col-start-3 md:row-start-1 md:w-18',
				'transition-colors duration-300',
				!type && 'text-purple-2',
				isHighlighted && 'text-data-partly-achieved'
			]}
		>
			{score === undefined ? 'N/A' : `${score.toFixed(2)}%`}
		</span>
	</div>
{/snippet}

<div class={['flex flex-col gap-4 bg-black p-4 text-white md:p-7', className]}>
	<div class="flex flex-row flex-wrap items-center gap-x-8 gap-y-2">
		<div class="flex min-w-0 flex-row items-center gap-3">
			<span class="font-bold text-gray-4">Compare</span>
			<Dropdown
				options={chamberScopeOptions}
				value={compare}
				color="light"
				onselect={(chamber) => (compare = chamber)}
			/>
		</div>

		<div class="flex min-w-0 flex-row items-center gap-3">
			<span class="font-bold text-gray-4">Highlight</span>
			<Combobox
				options={highlightOptions}
				value={highlighted}
				placeholder="Select country"
				color="light"
				onselect={(value) => (highlighted = value)}
			/>
		</div>
	</div>

	<div class="flex flex-row flex-wrap items-center gap-2 b5 text-gray-4">
		<span class="font-bold">Parliamentary type</span>
		{#each parliamentTypes as type (type)}
			<span class="flex flex-row items-center gap-1.5">
				{@render typeBadge(type)}
				{type}
			</span>
		{/each}
	</div>

	<div class="flex flex-col">
		<div class={[rowClass, headingPaddingClass, 'b4 text-gray-4']}>
			<span class={rankClass}>Rank</span>
			<span class={iconSpacerClass} aria-hidden="true"></span>
			<div
				class="grid flex-1 grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-x-6"
			>
				<span class="col-start-2 row-start-1 justify-self-end md:justify-self-start">
					<Tooltip triggerClass="text-gray-4">
						{#snippet trigger()}
							{scoreLabel}
							<Information size={16} class="text-purple-3" />
						{/snippet}
						<strong>How the score is calculated</strong>
						<br /><br />
						<strong
							>1. Overall Score = (Sum of all Dimension Raw Score ÷ Total Applicable Score) × 100</strong
						><br />
						The Overall Score aggregates the scores across all applicable questions and converts them
						into a percentage.<br /><br />
						<strong>2. Dimension Score = (Raw Score ÷ Total Applicable Score) × 100</strong><br />
						The Dimension Score is calculated in the same way as the Overall Score, but only includes
						questions within that dimension.<br /><br />
						The total applicable score may vary between countries because some questions may not apply
						to certain national contexts. These questions are excluded from the calculation, so each parliament
						is scored only on the questions relevant to its context.<br /><br />
						<strong
							>3. Aggregated overall/dimension score = (Score of Both Chambers ÷ Total Applicable
							Score of Both Chambers) × 100</strong
						><br />
						For bicameral countries, the scores of the two chambers are aggregated to produce a single
						score for the Parliament as a whole.
					</Tooltip>
				</span>
				<span class="hidden md:col-start-3 md:block md:w-18"></span>
			</div>
		</div>

		{#each rows as row (row.key)}
			<div class="border-t border-gray-10" animate:flip={{ duration: 300 }}>
				{#if row.country}
					<Accordion
						headerClass="{rowClass} {rowPaddingClass} hover:bg-gray-9"
						toggleClass={row.score === undefined ? 'opacity-40' : undefined}
						contentClass="px-4 pt-0 pb-4 md:pb-6"
						iconClass="size-5 text-purple-3 self-start md:self-center -my-0.5 md:my-0 md:size-6"
					>
						{#snippet leading()}
							<span class={[rankClass, 'font-mono']}>{row.rank ?? '-'}</span>
						{/snippet}

						{#snippet header()}
							{@render scoreRow(
								row.country.name,
								row.score,
								row.country.parliamentType,
								highlighted.includes(row.country.slug)
							)}
						{/snippet}

						{#snippet content()}
							<div class="flex flex-1 flex-col gap-4 pt-2 md:pt-4">
								<div class="flex flex-col gap-1">
									<span class="b5 text-gray-4">Country context</span>
									<CountryContext country={row.country} variant="dark" />
								</div>
								<Button
									size="small"
									href={resolve('/countries/[country]', { country: row.country.slug })}
									class="self-end"
								>
									Explore more
								</Button>
							</div>
						{/snippet}
					</Accordion>
				{:else}
					<div class={[rowClass, rowPaddingClass]}>
						<span class={rankClass}></span>
						<span class={iconSpacerClass} aria-hidden="true"></span>
						<div class="flex-1">
							{@render scoreRow('Average', row.score)}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
