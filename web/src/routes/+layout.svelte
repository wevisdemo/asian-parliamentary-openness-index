<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} /><link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300..700&display=swap"
		rel="stylesheet"
	/></svelte:head
>

<div class="flex min-h-screen w-full flex-col">
	<Navbar />

	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>

	<Footer />
</div>
