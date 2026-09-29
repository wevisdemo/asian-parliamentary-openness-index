<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.png';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import DraftBanner from '$lib/components/draft-banner.svelte';
	import { createGlossaryState } from '$lib/components/glossary/glossary-state.svelte';

	let { data, children } = $props();

	createGlossaryState();

	const isStandalone = $derived(
		page.route.id === '/survey-generator' || page.route.id === '/design-system'
	);
</script>

<svelte:head
	><link rel="icon" href={favicon} /><link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300..700&family=Spline+Sans+Mono:wght@400;700&display=swap"
		rel="stylesheet"
	/></svelte:head
>

<div class="flex min-h-screen w-full flex-col">
	{#if !isStandalone}
		<Navbar glossary={data.glossary} />
	{/if}

	<main class="flex flex-1 flex-col bg-white">
		{@render children()}
	</main>

	{#if !isStandalone}
		<Footer />

		<DraftBanner />
	{/if}
</div>
