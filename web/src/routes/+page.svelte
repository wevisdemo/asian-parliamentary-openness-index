<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import landingAnimation from '$lib/assets/animations/landing.svg';
	import AudienceCards from '$lib/components/about/audience-cards.svelte';
	import DimensionCards from '$lib/components/about/dimension-cards.svelte';
	import CountryScoreChart from '$lib/components/assessment/country-score-chart.svelte';
	import Button from '$lib/components/button.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { aboutSections } from '$lib/constants/about-sections';
	import { alliance } from '$lib/constants/contributors';
	import type { PageProps } from './$types';
	import Sharer from '$lib/components/sharer.svelte';

	const exploreActions = [
		{
			title: 'Explore by country',
			description: "See every country's chamber-by-chamber breakdown and indicator-level detail.",
			label: 'Explore',
			href: resolve('/countries')
		},
		{
			title: 'Explore by indicator',
			description: 'See how every country compares on a single indicator, question by question.',
			label: 'Explore',
			href: resolve('/indicators')
		}
	];

	const { data }: PageProps = $props();

	const rankedDimensions = $derived(data.dimensionScores.toSorted((a, b) => b.score - a.score));
	const leading = $derived(rankedDimensions[0]);
	const lagging = $derived(rankedDimensions[rankedDimensions.length - 1]);

	const percentage = (score: number) => `${Math.round(score)}%`;
</script>

<Metadata />

{#snippet seeMore(section: (typeof aboutSections)[number])}
	<Hyperlink href="{resolve('/about')}#{section.id}" class="self-end">See more</Hyperlink>
{/snippet}

<section
	class="relative flex min-h-[calc(100vh-var(--navbar-height))] flex-col items-end justify-center overflow-hidden bg-gray-2 px-5 py-16 md:min-h-[calc(100vh-var(--navbar-height-md))]"
>
	<img
		src={landingAnimation}
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute top-0 left-1/2 h-[70vh] w-auto max-w-none -translate-x-1/2 md:h-auto md:w-screen"
	/>
	<div class="relative mx-auto flex w-full max-w-6xl md:justify-end md:px-12">
		<div
			class="flex w-full max-w-2xl flex-col items-center gap-4 text-center md:items-start md:text-left"
		>
			<h1 class="h2 font-bold">Asian Parliamentary Openness Index</h1>
			<p class="b2">A regional index tracking how openly Asia-Pacific parliaments operate.</p>
			<div class="my-2 grid w-full grid-cols-1 gap-2 md:grid-cols-3">
				<Button href={resolve('/insights')}>Insights</Button>
				<Button href={resolve('/countries')} variant="secondary">Explore by country</Button>
				<Button href={resolve('/indicators')} variant="secondary">Explore by indicator</Button>
			</div>
			<Sharer />
		</div>
	</div>
</section>

<section class="grid grid-cols-1 gap-1 bg-gray-1 p-1 md:grid-cols-2">
	<div class="mx-auto flex flex-col items-start gap-4 px-5 py-8 md:max-w-lg md:gap-6 md:py-16">
		<div class="flex flex-col gap-1">
			<h2 class="h5 font-bold">{page.data.cycle.year} Insight</h2>
			<p class="b5 text-gray-6">Assessment Date: {page.data.cycle.assessmentDate}</p>
		</div>
		<p>
			Across {data.countryCount} parliaments assessed this cycle, the regional lower chamber average sits
			at {percentage(data.averageScore)}. {leading.dimension} leads the way regionally at
			{percentage(leading.score)}, while {lagging.dimension} lags furthest behind at
			{percentage(lagging.score)}.
		</p>
		<Button href={resolve('/insights')}>See more</Button>
	</div>
	<div class="grid grid-cols-1 gap-1 sm:grid-cols-2">
		<div class="flex flex-col justify-between gap-6 bg-black p-5 text-white md:p-7">
			<div class="flex flex-col gap-1">
				<h3 class="h5 font-bold">Score</h3>
				<p class="b4 text-purple-2">
					Average lower chamber score for {data.countryCount} countries
				</p>
				<p class="mt-1 h1 font-bold text-purple-2">{percentage(data.averageScore)}</p>
			</div>
			<CountryScoreChart
				scores={data.countryScores}
				average={data.averageScore}
				class="h-1/2 min-h-32"
			/>
		</div>
		<div class="grid grid-cols-1 gap-1">
			{#each data.dimensionScores as { dimension, score } (dimension)}
				<div
					class="flex flex-row justify-between gap-1 bg-black p-5 text-white md:flex-col md:p-7 md:pb-18"
				>
					<h3 class="b2 font-bold">{dimension}</h3>
					<div class="flex flex-col items-end md:items-start">
						<p class="b4 text-purple-2">Average</p>
						<p class="mt-1 h3 font-bold text-purple-2">{percentage(score)}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	{#each exploreActions as { title, description, label, href } (href)}
		<div class=" bg-purple-1">
			<div class="mx-auto flex flex-col items-start gap-4 px-5 py-8 md:max-w-lg md:gap-6 md:py-16">
				<h3 class="h5 font-bold">{title}</h3>
				<p>{description}</p>
				<Button {href}>{label}</Button>
			</div>
		</div>
	{/each}
</section>

<section>
	<div class="content-container flex flex-col gap-6 md:gap-8">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
			<h2 class="h5 font-bold">About the index</h2>
			<p>
				APOI assesses how openly national parliaments across the Asia-Pacific operate, so citizens,
				media, and reformers can see exactly where each parliament stands. Every parliament is
				scored against the same set of questions, organized into three dimensions of openness.
			</p>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="b2 font-bold text-gray-6">3 Dimensions</h3>
			<DimensionCards />
		</div>

		{@render seeMore(aboutSections[0])}

		<div
			class="grid grid-cols-1 gap-4 border-t-2 border-black pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
		>
			<h2 class="b1 font-bold">Methodology</h2>
			<p>
				The assessment covers {data.indicatorCount} indicators across three dimensions. It is conducted
				independently every two years (first launched in {page.data.cycle.year}) by local PMOs or
				think tanks using only publicly available information, with the findings verified by
				academic experts.
			</p>
		</div>

		{@render seeMore(aboutSections[1])}
	</div>
</section>

<section class="bg-gray-1">
	<div class="content-container flex flex-col gap-6 md:gap-8">
		<h2 class="h5 font-bold">Who this is for</h2>
		<AudienceCards />
	</div>
</section>

<section class="bg-gray-2">
	<div class="content-container flex flex-col gap-5">
		<h2 class="b2 font-bold text-gray-8">About contributors</h2>
		<p class="h5 font-bold">{alliance.name}</p>

		<div class="flex flex-col gap-4 md:flex-row md:gap-8">
			<img src={alliance.logo} alt="" class="w-full max-w-40 self-start object-contain" />
			<p class="flex-1">{alliance.description}</p>
		</div>

		<h3 class="border-t-2 pt-3 b3 font-bold text-gray-8">Our team</h3>
		<div class="flex flex-row flex-wrap gap-2">
			{#each data.teamLogos as { organization, logo } (organization)}
				<img src={logo} alt={organization} title={organization} class="size-16 object-contain" />
			{/each}
		</div>

		{@render seeMore(aboutSections[2])}
	</div>
</section>
