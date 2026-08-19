<script lang="ts">
	import { resolve } from '$app/paths';
	import { aboutSections } from '$lib/constants/about-sections';

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
	<div class="content-container flex flex-col gap-4 md:flex-row md:justify-between md:gap-8">
		<a href={resolve('/')} class="shrink-0">
			<img
				src="https://placehold.co/96x48/b6c4c7/35393a?text=Logo"
				alt="Asian Parliamentary Openness Index"
				class="h-10 w-auto"
			/>
		</a>

		<div class="flex flex-col gap-4 md:flex-row md:gap-16">
			<ul class="flex flex-col gap-2">
				{#each links as { label, href } (href)}
					<li><a {href} class="b4 font-bold hover:text-purple-3">{label}</a></li>
				{/each}
			</ul>

			<div class="flex flex-col gap-2">
				<a href={resolve('/about')} class="b4 font-bold hover:text-purple-3">About</a>
				<ul class="flex list-disc flex-col gap-1 pl-5">
					{#each aboutSections as { id, label } (id)}
						<li>
							<a href="{resolve('/about')}#{id}" class="b4 hover:text-purple-3">{label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</footer>
