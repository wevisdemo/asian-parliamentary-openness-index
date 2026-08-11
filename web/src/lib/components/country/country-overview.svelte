<script lang="ts">
	import type { Country } from '$lib/data/countries';
	import Hyperlink from '$lib/components/hyperlink.svelte';

	interface Props {
		country: Country;
		class?: string;
	}

	const { country, class: className }: Props = $props();
</script>

<div class={['grid grid-cols-1 md:grid-cols-2', className]}>
	<div class="flex flex-col gap-6">
		<h1 class="h2 font-bold">{country.name}</h1>
		<ul class="b4 text-gray-8">
			<li><strong>Government System:</strong> {country.governmentSystem}</li>
			<li><strong>Parliamentary type:</strong> {country.parliamentType}</li>
			<li><strong>Parliament Name:</strong> {country.parliamentName}</li>
			<li>
				<strong>Parliament Official Website:</strong>
				<Hyperlink href={country.parliamentWebsite} target="_blank" color="gray" class="break-all">
					{country.parliamentWebsite}
				</Hyperlink>
			</li>
		</ul>
		{#if country.keyFindings}
			<div class="flex flex-col gap-2 bg-gray-1 px-5 py-4">
				<span class="font-bold">Key findings</span>
				<p>{country.keyFindings}</p>
			</div>
		{/if}
	</div>
</div>
