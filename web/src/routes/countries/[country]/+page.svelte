<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import mapIllustration from '$lib/assets/images/map-illustration.png';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import Button from '$lib/components/button.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Modal from '$lib/components/modal.svelte';
	import CountryOverview from '$lib/components/country/country-overview.svelte';
	import Respondent from '$lib/components/country/respondent.svelte';
	import QuestionAnswer from '$lib/components/questionair/question-answer.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import { chamberOptions, dimensionOptions } from '$lib/data/enums';

	const { data } = $props();

	const breadcrumbItems = [
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	];

	const countryOptions = $derived(
		data.countries.map(({ name, slug }) => ({ label: name, value: slug }))
	);

	let selectedChamber = $state(chamberOptions[0].value);
	let selectedDimension = $state(dimensionOptions[0].value);

	let openModal = $state<'about' | 'methodology'>();

	const dimensionQuestions = $derived.by(() => {
		const indicatorNumbers = new Set(
			data.indicators
				.filter(({ dimension }) => dimension === selectedDimension)
				.map(({ number }) => number)
		);

		return data.questions.filter(({ indicatorNumber }) => indicatorNumbers.has(indicatorNumber));
	});

	const chamberAnswers = $derived(
		data.answers.filter(({ chamber }) => chamber === selectedChamber)
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
					options={countryOptions}
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
	<section class="mx-auto flex w-full max-w-5xl flex-col gap-6">
		{#if data.country.parliamentType === 'bicameral'}
			<Tabs
				options={chamberOptions}
				value={selectedChamber}
				onselect={(chamber) => (selectedChamber = chamber)}
			/>
		{/if}
		<div class="-mx-5 flex flex-1 overflow-x-scroll px-5 md:mx-0 md:overflow-visible md:px-0">
			<Tabs
				class="flex-1 whitespace-nowrap"
				options={dimensionOptions}
				value={selectedDimension}
				variant="secondary"
				onselect={(dimension) => (selectedDimension = dimension)}
			/>
		</div>

		<div class="flex flex-col gap-5 bg-white p-5">
			{#each dimensionQuestions as question, index (question.number)}
				<QuestionAnswer
					{question}
					answer={chamberAnswers.find(({ questionNumber }) => questionNumber === question.number)}
					class={index > 0 ? 'border-t border-gray-2 pt-5' : undefined}
				/>
			{/each}
		</div>
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
	<Button class="self-start">See more</Button>
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
	<Button class="self-start">See more</Button>
</Modal>
