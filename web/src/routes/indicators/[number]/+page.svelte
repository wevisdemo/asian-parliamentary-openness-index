<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hero from '$lib/components/hero.svelte';
	import DownloadDataCard from '$lib/components/download-data-card.svelte';
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
	import { quickFade } from '$lib/utils/transitions';
	import type { PageProps } from './$types';

	const statusLevels: AchievementLevel[] = ['Achieved', 'Partly achieved', 'Not achieved', 'N/A'];

	const { data }: PageProps = $props();

	let status = $state<AchievementLevel>();
	let statusTabs = $state<ReturnType<typeof Tabs<AchievementLevel>>>();

	const indicator = $derived(data.summary.indicator);

	const statusOptions = $derived(
		statusLevels.map((level) => {
			const count = data.countryResults.filter((result) => result.level === level).length;

			return {
				label: `${level} (${count})`,
				value: level,
				disabled: count === 0,
				colorClasses: achievementLevelTabColorClasses[level]
			};
		})
	);

	const availableStatusOptions = $derived(
		statusOptions.filter(({ disabled }) => !disabled).map(({ value }) => ({ label: value, value }))
	);

	const selectedStatus = $derived(
		(availableStatusOptions.find(({ value }) => value === status) ?? availableStatusOptions[0])
			?.value
	);

	const filteredResults = $derived(
		data.countryResults.filter(({ level }) => level === selectedStatus)
	);

	const selectStatus = (level: AchievementLevel) => {
		status = level;
		statusTabs?.scrollToContent();
	};
</script>

<Metadata page={indicator.name} />

<section class="bg-gray-2">
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
				<li><strong>Dimension Relevance:</strong> {indicator.dimensionRelevance}</li>
				<li><strong>Number of question:</strong> {data.summary.questionCount}</li>
			</ul>
		</div>

		<div class="flex h-fit flex-col gap-4 bg-white p-5 md:gap-8 md:p-8">
			<p class="flex flex-row flex-wrap items-end gap-x-3 gap-y-1">
				<span class="h3 leading-none font-bold text-data-achieved">
					{data.summary.achievedPercentage.toFixed(2)}%
				</span>
				<span class="flex-1">of countries <strong>achieved</strong> this indicator</span>
			</p>

			<AchievementBar countryCountByLevel={data.summary.countryCountByLevel} variant="loose" />
		</div>
	</Hero>
</section>

<div class="flex flex-col bg-gray-1">
	<section class="relative content-container flex flex-col gap-6 md:gap-8">
		<Tabs
			bind:this={statusTabs}
			options={statusOptions}
			value={selectedStatus}
			sticky
			onselect={selectStatus}
			class="bg-gray-1"
		/>

		<div class="flex flex-col gap-6 md:gap-8">
			{#key selectedStatus}
				{#if selectedStatus}
					<p in:quickFade class="b3">{achievementLevelDescriptions[selectedStatus]}</p>
				{/if}

				<div in:quickFade class="flex flex-col gap-4">
					{#each filteredResults as { country, answers, contexts } (country.slug)}
						<CountryAccordion {country} questions={data.questions} {answers} {contexts} />
					{/each}
				</div>
			{/key}
		</div>

		<Pagination options={availableStatusOptions} value={selectedStatus} onselect={selectStatus} />

		<DownloadDataCard />
	</section>
</div>
