<script lang="ts">
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { resolve } from '$app/paths';
	import exploreByCountryHeroImage from '$lib/assets/images/hero/explore-by-country.png';
	import Hero from '$lib/components/hero.svelte';
	import MoreActionsSection from '$lib/components/more-actions-section.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import SearchInput from '$lib/components/search-input.svelte';

	const { data } = $props();

	let searchQuery = $state('');

	const filteredCountries = $derived(
		data.countries.filter(({ name }) =>
			name.toLowerCase().includes(searchQuery.trim().toLowerCase())
		)
	);

	const gridClasses = 'grid grid-cols-[1fr_1.5rem] items-baseline gap-x-4 px-4 py-2.5';
</script>

<Metadata page="Explore by Country" />

<section class="relative overflow-clip bg-gray-2">
	<img
		src={exploreByCountryHeroImage}
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute right-0 bottom-0 w-full select-none md:top-0 md:w-[50vw]"
	/>

	<Hero
		breadcrumbItems={[
			{ label: 'Home', href: resolve('/') },
			{ label: 'Explore by Country', href: resolve('/countries') }
		]}
		showIndexInfo
	>
		<div class="flex flex-col gap-6">
			<h1 class="h2 font-bold">Explore by Country</h1>
			<p>See every country's chamber-by-chamber breakdown and indicator-level detail.</p>
		</div>
	</Hero>
</section>

<section>
	<div class="content-container flex flex-col">
		<SearchInput
			bind:value={searchQuery}
			placeholder="Search country"
			class="mb-6 w-full self-start md:max-w-1/2"
		/>

		<div class={[gridClasses, 'b4 text-gray-6']}>
			<span>Country name</span>
		</div>

		{#each filteredCountries as country (country.slug)}
			<a
				href={resolve('/countries/[country]', { country: country.slug })}
				class={[gridClasses, 'border-t border-gray-2 transition-colors hover:bg-gray-1']}
			>
				<span class="b2 font-bold">{country.name}</span>
				<span class="self-center justify-self-end">
					<ChevronRight size={20} class="text-gray-6" />
				</span>
			</a>
		{:else}
			<p class="border-t border-gray-2 px-4 py-10 text-center text-gray-8">
				No data for '{searchQuery}'
			</p>
		{/each}

		<MoreActionsSection />
	</div>
</section>
