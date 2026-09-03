<script lang="ts">
	import { resolve } from '$app/paths';
	import exploreByIndicatorDesktopImage from '$lib/assets/images/hero/explore-by-indicator-desktop.png';
	import exploreByIndicatorMobileImage from '$lib/assets/images/hero/explore-by-indicator-mobile.png';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hero from '$lib/components/hero.svelte';
	import ListGroup from '$lib/components/list-group.svelte';
	import MoreActionsSection from '$lib/components/more-actions-section.svelte';
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

<section class="relative overflow-clip bg-gray-2">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 bg-size-[auto_100%] bg-right bg-no-repeat select-none md:hidden"
		style="background-image: url({exploreByIndicatorMobileImage})"
	></div>

	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-size-[auto_100%] bg-left bg-repeat-x select-none md:block"
		style="background-image: url({exploreByIndicatorDesktopImage})"
	></div>

	<Hero
		breadcrumbItems={[
			{ label: 'Home', href: resolve('/') },
			{ label: 'Explore by Indicator', href: resolve('/indicators') }
		]}
		showIndexInfo
	>
		<div class="flex flex-col gap-6">
			<h1 class="h2 font-bold">Explore by Indicator</h1>
			<p>See how every country compares on a single indicator, question by question.</p>
		</div>
	</Hero>
</section>

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
				<div class="flex flex-row flex-wrap gap-2">
					<h2 class="b1 font-bold">
						{dimensionSummaries.length}
						{dimensionSummaries.length === 1 ? 'Indicator' : 'Indicators'}
					</h2>
					<div class="mr-auto flex flex-row items-center gap-2 text-gray-6 md:mt-1">
						<span class="b4 whitespace-nowrap">Sorted by</span>
						<Dropdown
							options={sortByOptions}
							value={selectedSortBy}
							color="gray"
							variant="compact"
							onselect={(sortBy) => (selectedSortBy = sortBy)}
						/>
					</div>
					<AchievementLegend />
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

		<MoreActionsSection />
	</section>
</div>
