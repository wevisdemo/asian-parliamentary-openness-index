<script lang="ts">
	import { resolve } from '$app/paths';
	import Hero from '$lib/components/hero.svelte';
	import MoreActionCard from '$lib/components/more-action-card.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Explore by Country · Asian Parliamentary Openness Index</title>
</svelte:head>

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'Insights', href: resolve('/insights') }
	]}
	class="bg-gray-1"
>
	<div class="flex flex-col gap-6">
		<h1 class="h2 font-bold">Insights</h1>
		<div class="flex flex-col gap-2">
			<p class="b3 font-bold">{data.countryCount} Countries were assessed</p>
			<p class="b5">
				As this is the inaugural assessment cycle, it includes only the {data.countryCount} founding member
				countries of the AAPO network. The assessment will expand to include more countries in future
				cycles.
			</p>
		</div>
	</div>
</Hero>

<section class="bg-gray-2 px-5 py-7 md:py-16">
	<div class="content-container grid grid-cols-1 md:grid-cols-2">
		<h2 class="h4 font-bold">Overall Score</h2>
		<div class="flex flex-col gap-4 border-gray-6 md:border-l-2 md:pl-8">
			<span class="font-bold text-gray-10">Key finding:</span>
			<p>
				Parliamentary openness varies widely across the Asia-Pacific. <strong
					>Taiwan, Australia, and South Korea</strong
				> achieved the highest overall scores. In several bicameral legislatures, the upper chamber scores
				noticeably lower than the lower chamber.
			</p>
		</div>
	</div>
</section>

<section class="px-5 py-7 md:py-16">
	<div class="content-container grid grid-cols-1 md:grid-cols-2">
		<h2 class="h4 font-bold">Compare by Dimension</h2>
		<div class="flex flex-col gap-4 border-gray-4 md:border-l-2 md:pl-8">
			<span class="font-bold text-gray-10">Key finding:</span>
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

	<MoreActionCard
		class="content-container mt-7 md:mt-16"
		title="Go deeper into the data"
		description="Explore every country's full profile, or browse the index indicator by indicator."
		actions={[{ label: 'Explore by country', href: resolve('/countries') }]}
	/>
</section>
