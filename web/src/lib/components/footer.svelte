<script lang="ts">
	import { resolve } from '$app/paths';
	import apoiLongLogo from '$lib/assets/images/apoi-long.png';
	import { aboutSections } from '$lib/constants/about-sections';
	import { downloadSections } from '$lib/constants/download-sections';

	interface FooterLink {
		label: string;
		href: string;
	}

	const links: FooterLink[] = [
		{ label: 'Home', href: resolve('/') },
		{ label: 'Insights', href: resolve('/insights') },
		{ label: 'Explore by Country', href: resolve('/countries') },
		{ label: 'Explore by Indicator', href: resolve('/indicators') }
	];
</script>

<footer class="bg-gray-9 text-white">
	<div class="content-container flex flex-col flex-wrap justify-between gap-4 md:flex-row md:gap-8">
		<a href={resolve('/')} class="shrink-0">
			<img
				src={apoiLongLogo}
				alt="Asian Parliamentary Openness Index"
				class="h-12 w-auto brightness-0 invert md:h-14"
			/>
		</a>

		<nav class="flex flex-col flex-wrap gap-4 sm:flex-row md:gap-16">
			<ul class="flex flex-col gap-2">
				{#each links as { label, href } (href)}
					<li><a {href} class="font-bold">{label}</a></li>
				{/each}
			</ul>

			<div class="flex flex-col gap-2">
				<a href={resolve('/downloads')} class="font-bold">Downloads</a>
				<ul class="flex list-disc flex-col gap-1 pl-5">
					{#each downloadSections as { id, label } (id)}
						<li>
							<a href="{resolve('/downloads')}#{id}">{label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex flex-col gap-2">
				<a href={resolve('/about')} class="font-bold">About</a>
				<ul class="flex list-disc flex-col gap-1 pl-5">
					{#each aboutSections as { id, label } (id)}
						<li>
							<a href="{resolve('/about')}#{id}">{label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<a href="mailto:contact@aapo-apoi.com" class="text-purple-2">contact@aapo-apoi.com</a>
			</div>
		</nav>
	</div>
</footer>

<style lang="postcss">
	@reference '../../routes/layout.css';

	nav a {
		@apply b4 hover:text-purple-3;
	}
</style>
