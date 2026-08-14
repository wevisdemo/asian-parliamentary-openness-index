<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import mapIllustration from '$lib/assets/images/map-illustration.png';
	import CountryContext from '$lib/components/country/country-context.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Pagination from '$lib/components/pagination.svelte';
	import DimensionTabs from '$lib/components/questionair/dimension-tabs.svelte';
	import IndicatorAccordion from '$lib/components/questionair/indicator-accordion.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import { achievementLevelDescriptions, achievementLevels } from '$lib/constants/achievements';
	import { chamberOptions } from '$lib/constants/chambers';
	import {
		dimensionDescriptions,
		dimensionOptions,
		type Dimension
	} from '$lib/constants/dimensions';
	import { getAchievementLevel } from '$lib/data/answers';

	const { data } = $props();

	const groupByOptions = [
		{ label: 'Achievement Level', value: 'achievement-level' },
		{ label: 'Dimension Relevance', value: 'dimension-relevance' }
	];

	let selectedChamber = $state(chamberOptions[0].value);
	let selectedDimension = $state(dimensionOptions[0].value);
	let selectedGroupBy = $state(groupByOptions[0].value);

	let dimensionTabs = $state<ReturnType<typeof DimensionTabs>>();

	const selectDimension = (dimension: Dimension) => {
		selectedDimension = dimension;
		dimensionTabs?.scrollToContent();
	};

	const chamberAnswers = $derived(
		data.answers.filter(({ chamber }) => chamber === selectedChamber)
	);

	const chamberContexts = $derived(
		data.indicatorContexts.filter(({ chamber }) => chamber === selectedChamber)
	);

	const dimensionIndicators = $derived(
		data.indicatorQuestions
			.filter(({ indicator }) => indicator.dimension === selectedDimension)
			.map(({ indicator, questions }) => {
				const answers = questions
					.map((question) =>
						chamberAnswers.find(({ questionNumber }) => questionNumber === question.number)
					)
					.filter((answer) => answer !== undefined);

				return { indicator, questions, achievementLevel: getAchievementLevel(answers) };
			})
	);

	const indicatorGroups = $derived.by(() =>
		selectedGroupBy === 'achievement-level'
			? achievementLevels
					.map((level) => ({
						name: level,
						description: achievementLevelDescriptions[level],
						indicators: dimensionIndicators.filter(
							({ achievementLevel }) => achievementLevel === level
						)
					}))
					.filter(({ indicators }) => indicators.length)
			: [...new Set(dimensionIndicators.map(({ indicator }) => indicator.dimensionRelevance))].map(
					(relevance) => ({
						name: relevance,
						description: undefined,
						indicators: dimensionIndicators.filter(
							({ indicator }) => indicator.dimensionRelevance === relevance
						)
					})
				)
	);
</script>

<svelte:head>
	<title>{data.country.name} · Asian Parliamentary Openness Index</title>
</svelte:head>

<section class="relative overflow-clip bg-gray-2">
	<img
		src={mapIllustration}
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute top-30 left-1/2 w-[110vw] max-w-none min-w-15 -translate-x-1/2 select-none"
	/>

	<Hero
		breadcrumbItems={[
			{ label: 'Home', href: resolve('/') },
			{ label: 'Explore by Country', href: resolve('/countries') }
		]}
	>
		{#snippet breadcrumbTrailing()}
			<Dropdown
				class="inline"
				variant="compact"
				options={data.countryOptions}
				value={data.country.slug}
				onselect={(country) => goto(resolve('/countries/[country]', { country }))}
			/>
		{/snippet}

		<div class="flex flex-col gap-6">
			<h1 class="h2 font-bold">{data.country.name}</h1>
			<CountryContext country={data.country} />
			{#if data.country.keyFindings}
				<div class="flex flex-col gap-2 bg-gray-1 px-5 py-4">
					<span class="font-bold">Key findings</span>
					<p>{data.country.keyFindings}</p>
				</div>
			{/if}
		</div>
	</Hero>
</section>

<div class="flex flex-col bg-gray-1">
	<section class="relative content-container flex flex-col gap-6 md:gap-8">
		{#if data.country.parliamentType === 'Bicameral'}
			<Tabs
				options={chamberOptions}
				value={selectedChamber}
				onselect={(chamber) => (selectedChamber = chamber)}
			/>
		{/if}

		<DimensionTabs
			bind:this={dimensionTabs}
			value={selectedDimension}
			onselect={selectDimension}
			class="bg-gray-1"
		/>

		<div class="flex flex-col gap-6 md:gap-8">
			{#key `${selectedChamber}-${selectedDimension}`}
				<p in:fade={{ duration: 150 }} class="b3">
					{dimensionDescriptions[selectedDimension]}
				</p>
			{/key}
			<div class="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
				<h3 class="b1 font-bold">{dimensionIndicators.length} Indicators</h3>
				<div class="mt-1 flex flex-row items-center gap-2 text-gray-6">
					<span class="b4 whitespace-nowrap">Grouped by</span>
					<Dropdown
						options={groupByOptions}
						value={selectedGroupBy}
						color="gray"
						variant="compact"
						onselect={(groupBy) => (selectedGroupBy = groupBy)}
					/>
				</div>
			</div>

			<div class="flex flex-col gap-6">
				{#each indicatorGroups as group (group.name)}
					<div
						in:fade={{ duration: 150 }}
						class="flex flex-col gap-4 border-t-2 border-gray-6 pt-4"
					>
						<div class="flex flex-col b4 text-gray-6">
							<h4>
								<span class="font-bold text-gray-8">{group.name}</span>
								<span>
									({group.indicators.length}
									{group.indicators.length === 1 ? 'Indicator' : 'Indicators'})
								</span>
							</h4>
							{#if group.description}
								<p class=" text-gray-6">{group.description}</p>
							{/if}
						</div>

						{#each group.indicators as { indicator, questions }, index (`${selectedChamber}-${selectedDimension}-${group.name}-${index}`)}
							<div in:fade={{ duration: 150 }}>
								<IndicatorAccordion
									{indicator}
									{questions}
									answers={chamberAnswers}
									context={chamberContexts.find(
										({ indicatorNumber }) => indicatorNumber === indicator.number
									)}
								/>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<Pagination
			options={dimensionOptions}
			value={selectedDimension}
			onselect={selectDimension}
			class="mt-4"
		/>

		{#if data.respondents.length}
			<div class="mt-8 flex flex-col gap-6 md:mt-16">
				<h2 class="border-t-4 border-gray-8 pt-6 b2 font-bold text-gray-8">About the Respondent</h2>

				{#each data.respondents as respondent, index (index)}
					<div
						class={[
							'grid grid-cols-1 gap-4 text-gray-8 md:grid-cols-2 md:gap-8',
							index > 0 && 'border-t border-gray-2 pt-6'
						]}
					>
						<div class="flex flex-col gap-4">
							{#if respondent.organization || respondent.about}
								<div class="flex flex-col gap-1">
									{#if respondent.organization}
										<h3 class="font-bold">{respondent.organization}</h3>
									{/if}
									{#if respondent.about}
										<p class="whitespace-pre-line">{respondent.about}</p>
									{/if}
								</div>
							{/if}

							{#if respondent.yearsOfExperience}
								<div class="flex flex-col gap-1">
									<p class="b4 text-gray-6">
										Years of experience of parliament monitoring by the organization
									</p>
									<p>{respondent.yearsOfExperience}</p>
								</div>
							{/if}
						</div>

						<div class="flex flex-col gap-4">
							{#if respondent.names?.length}
								<div class="flex flex-col gap-1">
									<p class="b4 text-gray-6">Name of respondent</p>
									<ul class="list-disc pl-5">
										{#each respondent.names as name (name)}
											<li>{name}</li>
										{/each}
									</ul>
								</div>
							{/if}
							{#if respondent.email}
								<div class="flex flex-col gap-1">
									<p class="b4 text-gray-6">Email of respondent to correspond with</p>
									<p>{respondent.email}</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
