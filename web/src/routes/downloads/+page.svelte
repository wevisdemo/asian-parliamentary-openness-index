<script lang="ts">
	import { resolve } from '$app/paths';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import dataset2026Url from '$data/APOI-2026.zip?url';
	import Hero from '$lib/components/hero.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import TocSidebar from '$lib/components/toc-sidebar.svelte';
	import { downloadSections } from '$lib/constants/download-sections';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const datasetUrls: Record<number, string> = { 2026: dataset2026Url };
</script>

<Metadata page="Downloads" />

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'Downloads', href: resolve('/downloads') }
	]}
	class="bg-gray-1"
>
	<h1 class="h2 font-bold">Downloads</h1>
</Hero>

<section>
	<div class="content-container flex flex-col gap-8 py-10 md:flex-row md:gap-16">
		<TocSidebar
			items={downloadSections}
			class="w-full shrink-0 self-start md:sticky md:top-28 md:flex md:w-56"
		/>

		<div class="flex flex-1 flex-col gap-6 md:gap-8">
			<h2 id={downloadSections[0].id}>Raw data</h2>

			{#each data.cycles as cycle (cycle.year)}
				<div class="flex flex-row items-start justify-between gap-6 bg-gray-1 p-6">
					<div class="flex flex-col gap-2">
						<h3 class="font-bold">
							{cycle.year} Asia Parliamentary Openness Index Result
						</h3>
						<div class="b4 text-gray-8">
							<p>Number of countries: {data.countryCount}</p>
							<p>Assessment date: {cycle.assessmentDate}</p>
							<p>Format: CSV</p>
						</div>
					</div>

					{#if datasetUrls[cycle.year]}
						<a
							href={datasetUrls[cycle.year]}
							download="APOI-{cycle.year}.zip"
							aria-label="Download {cycle.year} dataset"
							class="shrink-0 text-purple-5 transition-colors hover:text-black"
						>
							<Download size={24} />
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="postcss">
	@reference '../layout.css';

	h2 {
		@apply scroll-mt-20 border-t-4 pt-2 h4 font-bold md:pt-4;
	}
</style>
