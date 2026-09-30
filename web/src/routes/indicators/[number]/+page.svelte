<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import indicatorHeroImage from '$lib/assets/images/hero/indicator.png';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hero from '$lib/components/hero.svelte';
	import MoreActionsSection from '$lib/components/more-actions-section.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import Pagination from '$lib/components/pagination.svelte';
	import AchievementBar from '$lib/components/assessment/achievement-bar.svelte';
	import CountryAccordion from '$lib/components/assessment/country-accordion.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import {
		achievementLevelDescriptions,
		achievementLevelTabColorClasses,
		type AchievementLevel
	} from '$lib/constants/achievements';
	import { chamberOptions, type Chamber } from '$lib/constants/chambers';
	import { quickFade } from '$lib/utils/transitions';
	import type { PageProps } from './$types';

	const statusLevels: AchievementLevel[] = ['Achieved', 'Partly achieved', 'Not achieved', 'N/A'];

	const { data }: PageProps = $props();

	let chamber = $state<Chamber>();
	let status = $state<AchievementLevel>();
	let statusTabs = $state<ReturnType<typeof Tabs<AchievementLevel>>>();

	const indicator = $derived(data.indicator);

	const chamberTabOptions = $derived(
		chamberOptions.filter(({ value }) =>
			data.chamberResults.some((result) => result.chamber === value)
		)
	);

	const chamberResult = $derived(
		data.chamberResults.find((result) => result.chamber === chamber) ?? data.chamberResults[0]
	);

	const statusOptions = $derived(
		statusLevels.map((level) => ({
			label: `${level} (${chamberResult.countryResults.filter((result) => result.level === level).length})`,
			value: level,
			colorClasses: achievementLevelTabColorClasses[level]
		}))
	);

	const paginationOptions = statusLevels.map((value) => ({ label: value, value }));

	const selectedStatus = $derived(status ?? statusLevels[0]);

	const filteredResults = $derived(
		chamberResult.countryResults.filter(({ level }) => level === selectedStatus)
	);

	const selectStatus = (level: AchievementLevel) => {
		status = level;
		statusTabs?.scrollToContent();
	};
</script>

<Metadata page={indicator.name} />

<section class="relative overflow-clip bg-gray-2">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-left bg-repeat-x select-none md:block"
		style="background-image: url({indicatorHeroImage}); background-size: auto 100%"
	></div>

	<Hero
		breadcrumbItems={[
			{ label: 'Home', href: resolve('/') },
			{ label: 'Explore by Indicator', href: resolve('/indicators') }
		]}
		showIndexInfo
	>
		{#snippet breadcrumbTrailing()}
			<Dropdown
				class="inline max-w-40 md:max-w-64"
				variant="compact"
				options={data.indicatorOptions}
				value={`${indicator.number}`}
				onselect={(number) => goto(resolve('/indicators/[number]', { number }))}
			/>
		{/snippet}

		<div class="flex flex-col gap-6">
			<h1 class="h2 font-bold">{indicator.name}</h1>
			<ul class="space-y-1 b4 text-gray-8">
				<li><strong>Dimension:</strong> {indicator.dimension}</li>
				<li><strong>Dimension relevance:</strong> {indicator.dimensionRelevance}</li>
				<li><strong>Number of questions:</strong> {data.questions.length}</li>
			</ul>
		</div>

		<div class="flex h-fit flex-col gap-4 md:flex-row">
			{#each data.chamberResults as { chamber: resultChamber, summary } (resultChamber)}
				<div class="flex flex-1 flex-col gap-3 bg-white p-5 md:p-7">
					{#if data.chamberResults.length > 1}
						<p class="b3 font-bold">{resultChamber} chamber</p>
					{/if}
					<p class="flex flex-col gap-y-2">
						<span class="h4 leading-none font-bold text-data-achieved">
							{summary.achievedPercentage.toFixed(2)}%
						</span>
						<span class="flex-1">of countries <strong>achieved</strong> this indicator</span>
					</p>

					<AchievementBar countryCountByLevel={summary.countryCountByLevel} variant="loose" />
				</div>
			{/each}
		</div>
	</Hero>
</section>

<div class="flex flex-col bg-gray-1">
	<section class="relative content-container flex flex-col gap-6 md:gap-8">
		{#if chamberTabOptions.length > 1}
			<Tabs
				options={chamberTabOptions}
				value={chamberResult.chamber}
				onselect={(value) => (chamber = value)}
			/>
		{/if}

		<Tabs
			bind:this={statusTabs}
			options={statusOptions}
			value={selectedStatus}
			sticky
			onselect={selectStatus}
			class="bg-gray-1"
		/>

		<div class="flex flex-col gap-6 md:gap-8">
			{#key `${chamberResult.chamber}-${selectedStatus}`}
				<p in:quickFade class="b3">{achievementLevelDescriptions[selectedStatus]}</p>

				<div in:quickFade class="flex flex-col gap-4">
					{#each filteredResults as { country, answers } (country.slug)}
						<CountryAccordion {country} questions={data.questions} {answers} />
					{:else}
						<p class="px-4 py-10 text-center text-gray-8">No countries in this category.</p>
					{/each}
				</div>
			{/key}
		</div>

		<Pagination options={paginationOptions} value={selectedStatus} onselect={selectStatus} />

		<MoreActionsSection />
	</section>
</div>
