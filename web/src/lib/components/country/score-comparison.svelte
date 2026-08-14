<script lang="ts">
	import { flip } from 'svelte/animate';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import { resolve } from '$app/paths';
	import Accordion from '$lib/components/accordion.svelte';
	import Button from '$lib/components/button.svelte';
	import CountryContext from '$lib/components/country/country-context.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { parliamentTypes, type ParliamentType } from '$lib/constants/parliament-types';
	import type { Country } from '$lib/data/countries';

	interface Props {
		scores: { country: Country; score: number }[];
		class?: string;
	}

	const { scores, class: className }: Props = $props();

	const ranked = $derived(
		scores
			.toSorted((a, b) => b.score - a.score)
			.map((item, index, sorted) => ({
				...item,
				rank: sorted.findIndex(({ score }) => score === item.score) + 1 || index + 1
			}))
	);

	const average = $derived(
		ranked.length ? ranked.reduce((sum, { score }) => sum + score, 0) / ranked.length : 0
	);

	const rows = $derived(
		[
			...ranked.map((item) => ({ key: item.country.slug, ...item })),
			{ key: 'average', country: undefined, rank: undefined, score: average }
		].toSorted((a, b) => b.score - a.score)
	);

	const rankClass = 'w-6 shrink-0 self-start md:self-center text-left b4 md:w-8';
	const iconSpacerClass = 'w-6 shrink-0';
	const rowClass = 'flex flex-row gap-1';
	const rowPaddingClass = 'p-2 md:px-4';
	const headingPaddingClass = 'p-2 md:px-4';
</script>

{#snippet typeBadge(type: ParliamentType)}
	<span class="border border-current px-1 py-0.5 font-mono b5 leading-none font-normal"
		>{type[0]}</span
	>
{/snippet}

{#snippet scoreRow(label: string, score: number, type?: ParliamentType)}
	<div
		class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 text-left md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] md:gap-x-6"
	>
		<span
			class={[
				'col-start-1 row-start-1 flex min-w-0 flex-row items-center gap-2',
				!type && 'text-purple-2'
			]}
		>
			{#if type}
				{@render typeBadge(type)}
			{/if}
			<span class="b4 font-bold">{label}</span>
		</span>

		<div
			class="relative col-span-2 row-start-2 h-4 bg-gray-10 md:col-span-1 md:col-start-2 md:row-start-1 md:h-8"
		>
			<div
				class={['h-full transition-[width] duration-300', type ? 'bg-white' : 'bg-purple-2']}
				style="width: {score}%"
			></div>
			{#if type}
				<div
					class={[
						'absolute inset-y-0 -translate-x-px border-l-2 border-dashed transition-[left] duration-300',
						score > average ? 'border-purple-3' : 'border-purple-2'
					]}
					style="left: {average}%"
				></div>
			{/if}
		</div>

		<span
			class="col-start-2 row-start-1 text-right font-mono b4 md:col-start-3 md:row-start-1 md:w-18"
		>
			{score.toFixed(2)}%
		</span>
	</div>
{/snippet}

<div class={['flex flex-col gap-3 bg-black p-5 text-white', className]}>
	<div class="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 b5 text-gray-4">
		<span class="font-bold">Parliamentary type</span>
		{#each parliamentTypes as type (type)}
			<span class="flex flex-row items-center gap-1.5">
				{@render typeBadge(type)}
				{type}
			</span>
		{/each}
	</div>

	<div class="flex flex-col">
		<div class={[rowClass, headingPaddingClass, 'b5 text-gray-4']}>
			<span class={rankClass}>Rank</span>
			<span class={iconSpacerClass} aria-hidden="true"></span>
			<div
				class="grid flex-1 grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] md:gap-x-6"
			>
				<span class="col-start-2 row-start-1 justify-self-end md:justify-self-start">
					<Tooltip triggerClass="text-gray-4">
						{#snippet trigger()}
							Score
							<Information size={16} class="text-purple-3" />
						{/snippet}
						Percentage of the applicable points a parliament achieved across all questions of the index.
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
						contentClass="px-4 pt-0 pb-4 md:pb-6"
						iconClass="text-purple-3 self-start md:self-center -my-0.5 md:my-0"
					>
						{#snippet leading()}
							<span class={[rankClass, 'font-mono']}>{row.rank}</span>
						{/snippet}

						{#snippet header()}
							{@render scoreRow(row.country.name, row.score, row.country.parliamentType)}
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
