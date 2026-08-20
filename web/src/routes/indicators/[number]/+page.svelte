<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const indicator = $derived(data.summary.indicator);
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
	</Hero>
</section>
