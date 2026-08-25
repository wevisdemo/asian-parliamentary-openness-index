<script lang="ts">
	import { resolve } from '$app/paths';
	import landingAnimation from '$lib/assets/animations/landing.svg';
	import Button from '$lib/components/button.svelte';
	import Metadata from '$lib/components/metadata.svelte';
</script>

<Metadata />

<section
	class="relative flex min-h-[70vh] flex-col items-end justify-center overflow-hidden bg-gray-1 px-5 py-16"
>
	<img
		src={landingAnimation}
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute top-0 left-1/2 h-[70vh] w-auto max-w-none -translate-x-1/2 md:h-auto md:w-screen"
	/>
	<div
		class="relative flex max-w-3xl flex-col items-center gap-4 text-center md:items-start md:text-left"
	>
		<h1 class="h2 font-bold">Asian Parliamentary Openness Index</h1>
		<p class="b2">A regional index tracking how openly Asia-Pacific parliaments operate.</p>
		<div class="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
			<Button href={resolve('/insights')}>Insights</Button>
			<Button href={resolve('/countries')} variant="secondary">Explore by country</Button>
			<Button href={resolve('/indicators')} variant="secondary">Explore by indicator</Button>
		</div>
	</div>
</section>
