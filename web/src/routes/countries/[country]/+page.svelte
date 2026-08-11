<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import mapIllustration from '$lib/assets/images/map-illustration.png';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Modal from '$lib/components/modal.svelte';
	import Pagination from '$lib/components/pagination.svelte';
	import CountryOverview from '$lib/components/country/country-overview.svelte';
	import Respondent from '$lib/components/country/respondent.svelte';
	import Indicator from '$lib/components/questionair/indicator.svelte';
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

	const breadcrumbItems = [
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	];

	const groupByOptions = [
		{ label: 'Achievement Level', value: 'achievement-level' },
		{ label: 'Dimension Relevance', value: 'dimension-relevance' }
	];

	let selectedChamber = $state(chamberOptions[0].value);
	let selectedDimension = $state(dimensionOptions[0].value);
	let selectedGroupBy = $state(groupByOptions[0].value);

	let openModal = $state<'about' | 'methodology'>();

	let indicatorSection = $state<HTMLElement>();
	let dimensionTabs = $state<HTMLElement>();
	let dimensionDescription = $state<HTMLElement>();

	const selectDimension = async (dimension: Dimension) => {
		selectedDimension = dimension;

		await tick();

		if (!indicatorSection || !dimensionTabs || !dimensionDescription) return;

		const stickyOffset = parseFloat(getComputedStyle(dimensionTabs).top) || 0;
		const sectionGap = parseFloat(getComputedStyle(indicatorSection).rowGap) || 0;

		window.scrollTo({
			top:
				dimensionDescription.getBoundingClientRect().top +
				window.scrollY -
				dimensionTabs.offsetHeight -
				sectionGap -
				stickyOffset,
			behavior: 'smooth'
		});
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

	<div class="relative flex flex-col px-5 py-4">
		<Breadcrumb items={breadcrumbItems}>
			{#snippet trailing()}
				<Dropdown
					class="inline"
					options={data.countryOptions}
					value={data.country.slug}
					onselect={(country) => goto(resolve('/countries/[country]', { country }))}
				/>
			{/snippet}
		</Breadcrumb>

		<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 py-12 md:py-16">
			<div class="flex flex-col justify-between gap-2 md:flex-row">
				<div>
					<p class="b2 font-bold text-gray-8">Asia Parliamentary Openness Index 2026</p>
					<p class="b5 text-gray-6">Assessment Date: August 2026</p>
				</div>
				<div class="flex flex-row items-start gap-6 md:gap-8">
					<Hyperlink class="underline" onclick={() => (openModal = 'about')}>
						About the Index
					</Hyperlink>
					<Hyperlink class="underline" onclick={() => (openModal = 'methodology')}>
						Methodology
					</Hyperlink>
				</div>
			</div>
			<CountryOverview country={data.country} />
		</div>
	</div>
</section>

<div class="flex flex-col gap-12 bg-gray-1 px-5 py-12 md:py-16">
	<section
		bind:this={indicatorSection}
		class="relative mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-8"
	>
		{#if data.country.parliamentType === 'Bicameral'}
			<Tabs
				options={chamberOptions}
				value={selectedChamber}
				onselect={(chamber) => (selectedChamber = chamber)}
			/>
		{/if}

		<div
			bind:this={dimensionTabs}
			class="sticky top-12 z-40 -mx-5 flex flex-1 overflow-x-scroll bg-gray-1 px-5 md:top-16 md:mx-0 md:overflow-visible md:px-0"
		>
			<Tabs
				class="flex-1 whitespace-nowrap"
				options={dimensionOptions}
				value={selectedDimension}
				variant="secondary"
				onselect={selectDimension}
			/>
		</div>

		<p bind:this={dimensionDescription} class="b3">{dimensionDescriptions[selectedDimension]}</p>

		<div class="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
			<h3 class="b1 font-bold">{dimensionIndicators.length} Indicators</h3>
			<div class="mt-1 flex flex-row items-center gap-2 text-gray-6">
				<span class="b4 whitespace-nowrap">Grouped by</span>
				<Dropdown
					options={groupByOptions}
					value={selectedGroupBy}
					color="gray"
					onselect={(groupBy) => (selectedGroupBy = groupBy)}
				/>
			</div>
		</div>

		<div class="flex flex-col gap-6">
			{#each indicatorGroups as group (group.name)}
				<div class="flex flex-col gap-4 border-t-2 border-gray-6 pt-4">
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
						<Indicator
							{indicator}
							{questions}
							answers={chamberAnswers}
							context={chamberContexts.find(
								({ indicatorNumber }) => indicatorNumber === indicator.number
							)}
						/>
					{/each}
				</div>
			{/each}
		</div>

		<Pagination
			options={dimensionOptions}
			value={selectedDimension}
			onselect={selectDimension}
			class="mt-4"
		/>
	</section>
	{#if data.respondents.length}
		<section class="mx-auto flex w-full max-w-5xl flex-col gap-6">
			<h2 class="border-t-4 border-gray-8 pt-6 b2 font-bold text-gray-8">About the Respondent</h2>

			{#each data.respondents as respondent, index (respondent.organization)}
				<Respondent {respondent} class={index > 0 ? 'border-t border-gray-2 pt-6' : undefined} />
			{/each}
		</section>
	{/if}
</div>

<Modal open={openModal === 'about'} title="About the Index" onclose={() => (openModal = undefined)}>
	<p>
		The index assesses how openly national parliaments across Asia-Pacific operate, so citizens,
		media, and reformers can see exactly where each parliament stands. Every parliament is scored
		against the same set of questions, organized into three dimensions of openness: Transparency,
		Accountability, and Citizen Participation.
	</p>
</Modal>

<Modal
	open={openModal === 'methodology'}
	title="Methodology"
	onclose={() => (openModal = undefined)}
>
	<p>
		The assessment covers 31 indicators across three dimensions. It is conducted independently every
		two years (first launched in 2026) by local PMOs or think tanks using only publicly available
		information, with the findings verified by academic experts.
	</p>
</Modal>
