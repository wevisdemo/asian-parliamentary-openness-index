<script lang="ts">
	import { resolve } from '$app/paths';

	interface FooterLink {
		label: string;
		href: string;
	}

	const links: FooterLink[] = [
		{ label: 'Home', href: resolve('/') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	];
</script>

<footer class="bg-gray-9 text-white">
	<div
		class="content-container flex flex-col gap-4 px-5 py-10 md:flex-row md:justify-between md:gap-8 md:py-12"
	>
		<a href={resolve('/')} class="shrink-0">
			<img
				src="https://placehold.co/96x48/b6c4c7/35393a?text=Logo"
				alt="Asian Parliamentary Openness Index"
				class="h-10 w-auto"
			/>
		</a>

		<ul class="flex flex-col gap-2">
			{#each links as { label, href } (href)}
				<li><a {href} class="b4 font-bold hover:text-purple-3">{label}</a></li>
			{/each}
		</ul>
	</div>
</footer>
