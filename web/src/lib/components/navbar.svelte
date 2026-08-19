<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
	import Button from '$lib/components/button.svelte';
	import GlossarySidebar from '$lib/components/glossary/glossary-sidebar.svelte';
	import { getGlossaryState } from '$lib/components/glossary/glossary-state.svelte';
	import type { GlossaryTerm } from '$lib/data/glossary';

	interface NavLink {
		label: string;
		href: string;
	}

	interface Props {
		glossary: GlossaryTerm[];
	}

	const { glossary }: Props = $props();

	const links: NavLink[] = [
		{ label: 'Insights', href: resolve('/insights') },
		{ label: 'Explore by Country', href: resolve('/countries') },
		{ label: 'Explore by Indicator', href: resolve('/indicators') },
		{ label: 'About', href: resolve('/about') }
	];

	const glossaryState = getGlossaryState();

	let isMenuOpen = $state(false);

	const openGlossary = () => {
		isMenuOpen = false;
		glossaryState.open();
	};

	const isActive = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	afterNavigate(() => (isMenuOpen = false));
</script>

<header
	class="sticky top-0 z-50 h-(--navbar-height) border-b border-gray-1 bg-white md:h-(--navbar-height-md)"
>
	<nav class="mx-auto flex h-full items-center justify-between gap-8">
		<div class="flex flex-1 flex-row items-center justify-between p-2 md:p-3">
			<a href={resolve('/')} class="shrink-0">
				<img
					src="https://placehold.co/96x48/b6c4c7/35393a?text=Logo"
					alt="Asian Parliamentary Openness Index"
					class="h-8 w-auto md:h-12"
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

			<div class="hidden shrink-0 md:block">
				{@render glossaryButton()}
			</div>
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
			class="absolute inset-x-0 top-full border-b border-gray-2 bg-gray-1 px-6 py-4 md:hidden"
			transition:slide={{ duration: 200 }}
		>
			<ul class="flex flex-col gap-4">
				{#each links as { label, href } (href)}
					<li>
						<a {href} class={['block', isActive(href) && 'font-bold']}>{label}</a>
					</li>
				{/each}
			</ul>

			<div class="mt-6">
				{@render glossaryButton()}
			</div>
		</div>
	{/if}
</header>

{#snippet glossaryButton()}
	<Button variant="secondary" onclick={openGlossary}>
		Glossary
		{#snippet icon()}
			<Bookmark size={16} />
		{/snippet}
	</Button>
{/snippet}

<GlossarySidebar terms={glossary} />
