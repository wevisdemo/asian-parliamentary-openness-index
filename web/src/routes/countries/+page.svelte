<script lang="ts">
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
	import { resolve } from '$app/paths';
	import Hero from '$lib/components/hero.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import SearchInput from '$lib/components/search-input.svelte';

	const { data } = $props();

	let searchQuery = $state('');
	let rankOrder = $state<'asc' | 'desc'>('asc');

	const filteredCountries = $derived(
		data.countries
			.filter(({ name }) => name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
			.toSorted((a, b) => (rankOrder === 'asc' ? a.rank - b.rank : b.rank - a.rank))
	);

	const cellClasses = {
		rank: 'col-start-1 row-start-1',
		lowerChamber: 'md:col-start-3 md:row-start-1',
		upperChamber: 'md:col-start-4 md:row-start-1',
		overall: 'md:col-start-5 md:row-start-1',
		chevron: 'col-start-3 row-start-1 justify-self-end md:col-start-6 md:self-center'
	};

	const gridClasses =
		'grid grid-cols-[3rem_1fr_1.5rem] items-baseline gap-x-4 gap-y-2 px-4 py-2.5 md:grid-cols-[4rem_1fr_8rem_8rem_8rem_1rem] md:gap-y-0';

	const scoresClasses = 'col-span-full row-start-2 grid grid-cols-3 gap-x-4 md:contents';

	const formatScore = (score?: number) =>
		score === undefined ? '-' : `${(score * 100).toFixed(2)}%`;
</script>

<Metadata page="Explore by Country" />

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	]}
	showIndexInfo
	class="bg-gray-2"
>
	<div class="flex flex-col gap-6">
		<h1 class="h2 font-bold">Explore by Country</h1>
		<p>
			See every country's overall score, chamber-by-chamber breakdown, and indicator-level detail.
		</p>
	</div>
</Hero>

<section>
	<div class="content-container flex flex-col">
		<SearchInput
			bind:value={searchQuery}
			placeholder="Search country"
			class="mb-6 w-full self-start md:max-w-1/2"
		/>

		<div class={[gridClasses, 'b4 text-gray-6']}>
			<button
				type="button"
				onclick={() => (rankOrder = rankOrder === 'asc' ? 'desc' : 'asc')}
				class={[
					cellClasses.rank,
					'flex cursor-pointer items-center gap-1 text-purple-5 transition-colors hover:text-gray-6'
				]}
			>
				Rank
				{#if rankOrder === 'asc'}
					<ChevronUp class="shrink-0" size={16} />
				{:else}
					<ChevronDown class="shrink-0" size={16} />
				{/if}
			</button>
			<span class="md:col-start-2 md:row-start-1">Country Name</span>
			<div class={scoresClasses}>
				<span class={cellClasses.lowerChamber}>Lower Chamber</span>
				<span class={cellClasses.upperChamber}>Upper Chamber</span>
				<span class={cellClasses.overall}>Overall Score</span>
			</div>
		</div>

		{#each filteredCountries as country (country.slug)}
			<a
				href={resolve('/countries/[country]', { country: country.slug })}
				class={[gridClasses, 'border-t border-gray-2 transition-colors hover:bg-gray-1']}
			>
				<span class={[cellClasses.rank, 'font-mono b4 font-bold']}>{country.rank}</span>
				<span class="b2 font-bold md:col-start-2 md:row-start-1">{country.name}</span>
				<div class={scoresClasses}>
					<span class={[cellClasses.lowerChamber, 'font-mono text-gray-8']}>
						{formatScore(country.lowerChamberScore)}
					</span>
					<span class={[cellClasses.upperChamber, 'font-mono text-gray-8']}>
						{formatScore(country.upperChamberScore)}
					</span>
					<span class={[cellClasses.overall, 'font-mono font-bold']}>
						{formatScore(country.overallScore)}
					</span>
				</div>
				<span class={cellClasses.chevron}>
					<ChevronRight size={20} class="text-gray-6" />
				</span>
			</a>
		{:else}
			<p class="border-t border-gray-2 px-4 py-10 text-center text-gray-8">
				No data for '{searchQuery}'
			</p>
		{/each}
	</div>
</section>
