<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

	interface NavLink {
		label: string;
		href: string;
	}

	const links: NavLink[] = [
		{ label: 'Insights', href: resolve('/insights') },
		{ label: 'Explore by Country', href: resolve('/countries') }
	];

	let isMenuOpen = $state(false);

	const isActive = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	afterNavigate(() => (isMenuOpen = false));
</script>

<header class="sticky top-0 z-50 border-b border-gray-1 bg-white">
	<nav class="mx-auto flex items-center justify-between gap-8">
		<div class="flex flex-1 flex-row items-center justify-between p-2 md:px-6 md:py-3">
			<a href={resolve('/')} class="shrink-0">
				<img
					src="https://placehold.co/96x48/b6c4c7/35393a?text=Logo"
					alt="Asian Parliamentary Openness Index"
					class="h-8 w-auto md:h-10"
				/>
			</a>

			<ul class="hidden flex-1 items-center justify-center gap-10 md:flex">
				{#each links as { label, href } (href)}
					<li>
						<a
							{href}
							class={['whitespace-nowrap hover:text-purple-4', isActive(href) && 'font-bold']}
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<button
			type="button"
			class="h-full md:hidden {isMenuOpen ? 'bg-gray-1' : ''}"
			aria-expanded={isMenuOpen}
			aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (isMenuOpen = !isMenuOpen)}
		>
			{#if isMenuOpen}
				<Close size={32} class="size-12 p-2" />
			{:else}
				<Menu size={32} class="size-12 p-2" />
			{/if}
		</button>
	</nav>

	{#if isMenuOpen}
		<div
			class="absolute inset-x-0 top-full border-b border-gray-1 bg-gray-1 px-6 py-4 md:hidden"
			transition:slide={{ duration: 200 }}
		>
			<ul class="flex flex-col gap-4">
				{#each links as { label, href } (href)}
					<li>
						<a {href} class={['block', isActive(href) && 'font-bold']}>{label}</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</header>
