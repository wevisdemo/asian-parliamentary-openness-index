<script lang="ts">
	import { resolve } from '$app/paths';
	import landingAnimation from '$lib/assets/animations/landing.svg';
	import AudienceCards from '$lib/components/about/audience-cards.svelte';
	import DimensionCards from '$lib/components/about/dimension-cards.svelte';
	import SupportersList from '$lib/components/about/supporters-list.svelte';
	import Button from '$lib/components/button.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import {
		aboutSections,
		aboutTheIndexSummary,
		getMethodologySummary
	} from '$lib/constants/about-sections';
	import { partners } from '$lib/constants/partners';
	import { alliance } from '$lib/constants/contributors';
	import { siteName, siteTagline } from '$lib/constants/site';
	import type { PageProps } from './$types';
	import Sharer from '$lib/components/sharer.svelte';

	const exploreActions = [
		{
			title: 'Explore by Country',
			description: "See every country's chamber-by-chamber breakdown and indicator-level detail.",
			label: 'Explore',
			href: resolve('/countries')
		},
		{
			title: 'Explore by Indicator',
			description: 'See how every country compares on a single indicator, question by question.',
			label: 'Explore',
			href: resolve('/indicators')
		}
	];

	const { data }: PageProps = $props();
</script>

<Metadata />

{#snippet seeMore(section: (typeof aboutSections)[number])}
	<Hyperlink href="{resolve('/about')}#{section.id}" class="self-end b4">See more</Hyperlink>
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
			<h1 class="h2 font-bold">{siteName}</h1>
			<p class="b2">{siteTagline}</p>
			<div class="my-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
				<Button href={resolve('/countries')}>Explore by Country</Button>
				<Button href={resolve('/indicators')} variant="secondary">Explore by Indicator</Button>
			</div>
			<Sharer />
		</div>
	</div>
</section>

<section class="grid grid-cols-1 gap-1 bg-gray-1 p-1 md:grid-cols-2">
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
			<h2 class="h5 font-bold">About the Index</h2>
			<p>{aboutTheIndexSummary}</p>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="b2 font-bold text-gray-6">3 dimensions</h3>
			<DimensionCards />
		</div>

		{@render seeMore(aboutSections[0])}

		<div
			class="grid grid-cols-1 gap-4 border-t-2 border-black pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
		>
			<h2 class="b1 font-bold">Methodology</h2>
			<p class="whitespace-pre-line">
				{getMethodologySummary({
					indicatorCount: data.indicatorCount,
					questionCount: data.questionCount,
					firstCycleYear: data.cycle.year
				})}
			</p>
		</div>

		{@render seeMore(aboutSections[1])}
	</div>
</section>

<section class="bg-gray-1">
	<div class="content-container flex flex-col gap-6 md:gap-8">
		<h2 class="h5 font-bold">Who This Is For</h2>
		<AudienceCards />
	</div>
</section>

<section class="bg-gray-2">
	<div class="content-container flex flex-col gap-5">
		<h2 class="b2 font-bold text-gray-8">About contributors</h2>
		<p class="h5 font-bold">{alliance.name}</p>

		<div class="flex flex-col gap-4 md:flex-row md:gap-8">
			<img src={alliance.logo} alt="" class="w-full max-w-40 self-start object-contain" />
			<div class="flex flex-1 flex-col gap-2">
				<p>{alliance.description}</p>
				<Hyperlink href="mailto:contact@aapo-apoi.com">contact@aapo-apoi.com</Hyperlink>
			</div>
		</div>

		<h3 class="border-t-2 pt-5 b3 font-bold text-gray-8">Our team</h3>
		<div class="flex flex-row flex-wrap gap-2">
			{#each data.teamLogos as { organization, logo } (organization)}
				<img src={logo} alt={organization} title={organization} class="size-16 object-contain" />
			{/each}
		</div>

		<h3 class="border-t-2 pt-5 b3 font-bold text-gray-8">Academic and technical partners</h3>
		<div class="flex flex-row flex-wrap gap-2">
			{#each partners as { name, logo } (name)}
				<img src={logo} alt={name} title={name} class="size-16 object-contain" />
			{/each}
		</div>

		<h3 class="border-t-2 pt-5 b3 font-bold text-gray-8">Supporters</h3>
		<SupportersList />

		{@render seeMore(aboutSections[3])}
	</div>
</section>
