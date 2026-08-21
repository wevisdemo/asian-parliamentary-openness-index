<script lang="ts">
	import { resolve } from '$app/paths';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hero from '$lib/components/hero.svelte';
	import ListGroup from '$lib/components/list-group.svelte';
	import DownloadDataCard from '$lib/components/download-data-card.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import Pagination from '$lib/components/pagination.svelte';
	import AchievementLegend from '$lib/components/assessment/achievement-legend.svelte';
	import DimensionTabs from '$lib/components/assessment/dimension-tabs.svelte';
	import IndicatorCard from '$lib/components/assessment/indicator-card.svelte';
	import {
		dimensionDescriptions,
		dimensionOptions,
		type Dimension
	} from '$lib/constants/dimensions';
	import { quickFade } from '$lib/utils/transitions';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const sortByOptions = [
		{ label: '% achieved country', value: 'achieved-percentage' },
		{ label: 'Dimension relevance', value: 'dimension-relevance' }
	];

	let selectedDimension = $state(dimensionOptions[0].value);
	let selectedSortBy = $state(sortByOptions[0].value);

	let dimensionTabs = $state<ReturnType<typeof DimensionTabs>>();

	const selectDimension = (dimension: Dimension) => {
		selectedDimension = dimension;
		dimensionTabs?.scrollToContent();
	};

	const dimensionSummaries = $derived(
		data.indicatorSummaries.filter(({ indicator }) => indicator.dimension === selectedDimension)
	);

	const indicatorGroups = $derived.by(() =>
		selectedSortBy === 'achieved-percentage'
			? [{ name: undefined, summaries: dimensionSummaries }]
			: [...new Set(dimensionSummaries.map(({ indicator }) => indicator.dimensionRelevance))].map(
					(relevance) => ({
						name: relevance,
						summaries: dimensionSummaries.filter(
							({ indicator }) => indicator.dimensionRelevance === relevance
						)
					})
				)
	);
</script>

<Metadata page="Explore by Indicator" />

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Indicator', href: resolve('/indicators') }
	]}
	showIndexInfo
	class="bg-gray-2"
>
	<div class="flex flex-col gap-6">
		<h1 class="h2 font-bold">Explore by Indicator</h1>
		<p>See how every country compares on a single indicator, question by question.</p>
	</div>
</Hero>

<div class="flex flex-col bg-gray-1">
	<section class="relative content-container flex flex-col gap-6 md:gap-8">
		<DimensionTabs
			bind:this={dimensionTabs}
			value={selectedDimension}
			onselect={selectDimension}
			class="bg-gray-1"
		/>

		<div class="flex flex-col gap-6 md:gap-8">
			{#key selectedDimension}
				<p in:quickFade class="b3">
					{dimensionDescriptions[selectedDimension]}
				</p>
			{/key}

			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div class="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
						<h2 class="b1 font-bold">
							{dimensionSummaries.length}
							{dimensionSummaries.length === 1 ? 'Indicator' : 'Indicators'}
						</h2>
						<div class="mt-1 flex flex-row items-center gap-2 text-gray-6">
							<span class="b4 whitespace-nowrap">Sorted by</span>
							<Dropdown
								options={sortByOptions}
								value={selectedSortBy}
								color="gray"
								variant="compact"
								onselect={(sortBy) => (selectedSortBy = sortBy)}
							/>
						</div>
					</div>

					<AchievementLegend class="md:mt-1" />
				</div>

				{#each indicatorGroups as group (group.name)}
					<ListGroup
						name={group.name}
						postfix="({group.summaries.length} {group.summaries.length === 1
							? 'Indicator'
							: 'Indicators'})"
					>
						{#each group.summaries as summary (summary.indicator.number)}
							<IndicatorCard {...summary} />
						{/each}
					</ListGroup>
				{/each}
			</div>
		</div>

		<Pagination options={dimensionOptions} value={selectedDimension} onselect={selectDimension} />

		<DownloadDataCard />
	</section>
</div>
