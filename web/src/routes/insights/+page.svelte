<script lang="ts">
	import { resolve } from '$app/paths';
	import ScoreComparison from '$lib/components/country/score-comparison.svelte';
	import Hero from '$lib/components/hero.svelte';
	import ListGroup from '$lib/components/list-group.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import MoreActionCard from '$lib/components/more-action-card.svelte';
	import AchievementLegend from '$lib/components/questionair/achievement-legend.svelte';
	import DimensionTabs from '$lib/components/questionair/dimension-tabs.svelte';
	import IndicatorCard from '$lib/components/questionair/indicator-card.svelte';
	import {
		dimensionDescriptions,
		dimensionOptions,
		type Dimension
	} from '$lib/constants/dimensions';
	import { quickFade } from '$lib/utils/transitions';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let selectedDimension = $state(dimensionOptions[0].value);

	let dimensionTabs = $state<ReturnType<typeof DimensionTabs>>();

	const selectDimension = (dimension: Dimension) => {
		selectedDimension = dimension;
		dimensionTabs?.scrollToContent();
	};

	const insight = $derived(
		data.dimensionInsights.find(({ dimension }) => dimension === selectedDimension)
	);

	const indicatorGroups = $derived([
		{
			title: 'Most achieved',
			description: 'Indicator with the most countries achieving it',
			indicators: insight?.mostAchieved ?? []
		},
		{
			title: 'Least achieved',
			description: 'Indicator with the least countries achieving it',
			indicators: insight?.leastAchieved ?? []
		}
	]);
</script>

<Metadata page="Insights" />

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'Insights', href: resolve('/insights') }
	]}
	showIndexInfo
	class="bg-gray-1"
>
	<div class="flex flex-col gap-6">
		<h1 class="h2 font-bold">Insights</h1>
		<div class="flex flex-col gap-2">
			<p class="b3 font-bold">{data.countryCount} Countries were assessed</p>
			<p class="b5 text-gray-8">
				As this is the inaugural assessment cycle, it includes only the {data.countryCount} founding member
				countries of the AAPO network. The assessment will expand to include more countries in future
				cycles.
			</p>
		</div>
	</div>
</Hero>

<section class="bg-gray-2">
	<div class="content-container flex flex-col gap-6 md:gap-8">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
			<h2 class="h4 font-bold md:px-6">Overall Score</h2>
			<div class="flex flex-col gap-2 border-l-2 border-gray-6 pl-4 md:pl-8">
				<span class="font-bold text-gray-10">Key finding:</span>
				<p>
					Parliamentary openness varies widely across the Asia-Pacific. <strong
						>Taiwan, Australia, and South Korea</strong
					> achieved the highest overall scores. In several bicameral legislatures, the upper chamber
					scores noticeably lower than the lower chamber.
				</p>
			</div>
		</div>
		<ScoreComparison scores={data.countryScores} />
	</div>
</section>

<section>
	<div class="content-container flex flex-col gap-6 md:gap-8">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
			<h2 class="h4 font-bold md:px-6">Compare by Dimension</h2>
			<div class="flex flex-col gap-2 border-l-2 border-gray-4 pl-4 md:pl-8">
				<span class="font-bold text-gray-8">Key finding:</span>
				<p>
					<strong>Transparency</strong> is the strongest-performing dimension, with many parliaments
					publishing meeting agendas, parliamentary proceedings, and session broadcasts.
					<strong>Accountability</strong>
					is the weakest dimension across the region, particularly regarding asset declarations, conflict-of-interest
					disclosure, and oversight of publicly funded staff.
					<strong>Citizen Participation</strong> remains an area for improvement, with no parliament meeting
					all participation indicators.
				</p>
			</div>
		</div>

		<DimensionTabs
			bind:this={dimensionTabs}
			value={selectedDimension}
			onselect={selectDimension}
			class="bg-white"
		/>

		{#key selectedDimension}
			<div in:quickFade class="flex flex-col gap-2 text-gray-8">
				<p class="font-bold">
					{selectedDimension} contributes [{insight?.points}] out of {data.totalPoints} points to the
					overall score.
				</p>
				<p>
					{dimensionDescriptions[selectedDimension]}
				</p>
			</div>
		{/key}

		<ScoreComparison scores={insight?.countryScores ?? []} />

		<div class="flex flex-col gap-4 bg-gray-1 p-5 md:p-7">
			<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<h3 class="b1 font-bold">Top indicators in this dimension:</h3>
				<AchievementLegend class="shrink-0" />
			</div>

			{#each indicatorGroups as group (group.title)}
				<ListGroup name={group.title} description={group.description}>
					{#each group.indicators as summary, index (`${selectedDimension}-${group.title}-${index}`)}
						<IndicatorCard {...summary} />
					{/each}
				</ListGroup>
			{/each}
		</div>

		<MoreActionCard
			class="mt-6 md:mt-12"
			title="Go deeper into the data"
			description="Explore every country's full profile, or browse the index indicator by indicator."
			actions={[
				{ label: 'Explore by country', href: resolve('/countries') },
				{ label: 'Explore by indicator', href: resolve('/indicators') }
			]}
		/>
	</div>
</section>
