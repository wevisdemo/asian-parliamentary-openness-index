<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import mapIllustration from '$lib/assets/images/map-illustration.png';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import Button from '$lib/components/button.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Modal from '$lib/components/modal.svelte';

	const { data } = $props();

	const breadcrumbItems = [
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	];

	const countryOptions = $derived(
		data.countries.map(({ name, slug }) => ({ label: name, value: slug }))
	);

	let openModal = $state<'about' | 'methodology'>();
</script>

<svelte:head>
	<title>{data.country.name} · Asian Parliamentary Openness Index</title>
</svelte:head>

<div class="relative overflow-clip bg-gray-2">
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
				<p class="b2 font-bold text-gray-8">Asia Parliamentary Openness Index 2026</p>
				<div class="flex flex-row gap-6 md:gap-8">
					<Hyperlink class="underline" onclick={() => (openModal = 'about')}>
						About the Index
					</Hyperlink>
					<Hyperlink class="underline" onclick={() => (openModal = 'methodology')}>
						Methodology
					</Hyperlink>
				</div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2">
				<div class="flex flex-col gap-6">
					<h1 class="h2 font-bold">{data.country.name}</h1>
					<ul class="b4 text-gray-8">
						<li><strong>Government System:</strong> {data.country.governmentSystem}</li>
						<li>
							<strong>Parliamentary type:</strong>
							<span class="capitalize">{data.country.parliamentType}</span>
						</li>
						<li><strong>Parliament Name:</strong> {data.country.parliamentName}</li>
						<li>
							<strong>Parliament Official Website:</strong>
							<Hyperlink href={data.country.parliamentWebsite} target="_blank" color="gray">
								{data.country.parliamentWebsite}
							</Hyperlink>
						</li>
					</ul>
					<div class="flex flex-col gap-2 bg-gray-1 px-5 py-4">
						<span class="font-bold">Key findings</span>
						<p>{data.country.keyFindings}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
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
