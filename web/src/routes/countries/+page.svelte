<script lang="ts">
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { resolve } from '$app/paths';
	import Hero from '$lib/components/hero.svelte';

	const { data } = $props();

	const cellClasses = {
		rank: 'col-start-1 row-start-1',
		lowerChamber: 'md:col-start-3 md:row-start-1',
		upperChamber: 'md:col-start-4 md:row-start-1',
		overall: 'md:col-start-5 md:row-start-1',
		chevron: 'col-start-3 row-start-1 justify-self-end md:col-start-6 md:self-center'
	};

	const gridClasses =
		'grid grid-cols-[2rem_1fr_1.5rem] items-baseline gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[4rem_1fr_8rem_8rem_8rem_1rem] md:gap-y-0 md:py-3';

	const scoresClasses = 'col-span-full row-start-2 grid grid-cols-3 gap-x-4 md:contents';

	const formatScore = (score?: number) =>
		score === undefined ? '-' : `${(score * 100).toFixed(2)}%`;
</script>

<svelte:head>
	<title>Explore by Country · Asian Parliamentary Openness Index</title>
</svelte:head>

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	]}
	class="bg-gray-1"
>
	<div class="flex flex-col gap-6">
		<h1 class="h2 font-bold">Explore by Country</h1>
		<p>
			See every country's overall score, chamber-by-chamber breakdown, and indicator-level detail.
		</p>
	</div>
</Hero>

<section class="px-5 py-12 md:py-16">
	<div class="content-container flex flex-col">
		<div class={[gridClasses, 'b4 text-gray-6']}>
			<span class={cellClasses.rank}>Rank</span>
			<span class="md:col-start-2 md:row-start-1">Country Name</span>
			<div class={scoresClasses}>
				<span class={cellClasses.lowerChamber}>Lower Chamber</span>
				<span class={cellClasses.upperChamber}>Upper Chamber</span>
				<span class={cellClasses.overall}>Overall Score</span>
			</div>
		</div>

		{#each data.countries as country (country.slug)}
			<a
				href={resolve('/countries/[country]', { country: country.slug })}
				class={[gridClasses, 'border-t border-gray-2 transition-colors hover:bg-gray-1']}
			>
				<span class={[cellClasses.rank, 'b4 font-bold']}>{country.rank}</span>
				<span class="b2 font-bold md:col-start-2 md:row-start-1">{country.name}</span>
				<div class={scoresClasses}>
					<span class={[cellClasses.lowerChamber, 'text-gray-8']}>
						{formatScore(country.lowerChamberScore)}
					</span>
					<span class={[cellClasses.upperChamber, 'text-gray-8']}>
						{formatScore(country.upperChamberScore)}
					</span>
					<span class={[cellClasses.overall, 'font-bold']}>
						{formatScore(country.overallScore)}
					</span>
				</div>
				<span class={cellClasses.chevron}>
					<ChevronRight size={20} class="text-gray-6" />
				</span>
			</a>
		{/each}
	</div>
</section>
