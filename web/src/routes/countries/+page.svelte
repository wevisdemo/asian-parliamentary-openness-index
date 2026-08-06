<script>
	import { resolve } from '$app/paths';
	import { countries } from '$lib/data/countries';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Explore by Country', href: '/countries' }
	];
</script>

<svelte:head>
	<title>Explore by Country · Asian Parliamentary Openness Index</title>
</svelte:head>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />

	<ul class="mt-6 flex flex-col gap-2">
		{#each countries as { label, value } (value)}
			<li>
				<Hyperlink href={resolve('/countries/[country]', { country: value })}>{label}</Hyperlink>
			</li>
		{/each}
	</ul>
</div>
