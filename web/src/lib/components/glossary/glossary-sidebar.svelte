<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import SearchInput from '$lib/components/search-input.svelte';
	import { getGlossaryState } from '$lib/components/glossary/glossary-state.svelte';
	import { findTermByAlias, type GlossaryTerm } from '$lib/data/glossary';
	import { quickFade } from '$lib/utils/transitions';

	interface Props {
		terms: GlossaryTerm[];
	}

	const { terms }: Props = $props();

	const glossaryState = getGlossaryState();

	let search = $state('');

	const keyword = $derived(search.trim().toLowerCase());

	const selected = $derived(findTermByAlias(terms, glossaryState.selectedTerm));

	const matched = $derived(
		[...terms]
			.filter(({ term }) => !keyword || term.toLowerCase().includes(keyword))
			.sort((a, b) => a.term.localeCompare(b.term))
	);

	const showAllTerms = () => {
		search = '';
		glossaryState.showAllTerms();
	};

	const groups = $derived.by(() => {
		const letters = [...new Set(matched.map(({ term }) => term.charAt(0).toUpperCase()))];

		return letters.map((letter) => ({
			letter,
			terms: matched.filter(({ term }) => term.charAt(0).toUpperCase() === letter)
		}));
	});
</script>

<Dialog.Root open={glossaryState.isOpen} onOpenChange={(next) => !next && glossaryState.close()}>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isOpen })}
				{#if isOpen}
					<div {...props} class="fixed inset-0 z-100 bg-black/25" transition:quickFade></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>

		<Dialog.Content forceMount>
			{#snippet child({ props, open: isOpen })}
				{#if isOpen}
					<div
						{...props}
						class="fixed inset-y-0 right-0 z-100 flex h-dvh w-full flex-col bg-gray-1 shadow-xl md:max-w-100"
						transition:fly={{ x: 400, duration: 200 }}
					>
						<div class="flex flex-col gap-2 border-b border-gray-1 px-5 pt-4 pb-3 md:px-7 md:pt-6">
							<div class="flex items-start justify-between gap-4">
								<Dialog.Title class="b1 font-bold">Glossary</Dialog.Title>

								<Dialog.Close aria-label="Close glossary" class="cursor-pointer text-purple-5">
									<Close size={24} />
								</Dialog.Close>
							</div>

							<Dialog.Description class="b4 text-gray-6">
								Definitions of terms used in survey questions to ensure consistent understanding
							</Dialog.Description>

							{#if !selected}
								<SearchInput bind:value={search} placeholder="Search term" />
							{/if}
						</div>

						<div class="flex-1 auto-hide-scrollbar overflow-y-auto px-5 md:pr-4 md:pl-7">
							{#if selected}
								<button
									type="button"
									class="-ml-0.5 flex cursor-pointer items-center gap-1 self-start b4 text-purple-5 hover:underline"
									onclick={showAllTerms}
								>
									<ChevronLeft size={16} />
									All terms
								</button>
								{@render termList([selected])}
							{:else if !matched.length}
								<p class="py-4 b4 text-gray-8">No term matching '{search}'</p>
							{:else if keyword}
								{@render termList(matched)}
							{:else}
								{#each groups as { letter, terms: letterTerms } (letter)}
									<section>
										<h3 class="sticky top-0 bg-white px-2 py-1 font-bold text-gray-6">
											{letter}
										</h3>
										{@render termList(letterTerms)}
									</section>
								{/each}
							{/if}
						</div>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

{#snippet termList(listedTerms: GlossaryTerm[])}
	<dl class="flex flex-col divide-y divide-gray-2">
		{#each listedTerms as { term, definition } (term)}
			<div class="flex flex-col gap-1 py-4">
				<dt class="font-bold">{@render highlightedTerm(term)}</dt>
				<dd class="b4 text-gray-9 [&_a]:text-purple-5 [&_a]:hover:underline">
					{@html definition}
				</dd>
			</div>
		{/each}
	</dl>
{/snippet}

{#snippet highlightedTerm(term: string)}
	{@const matchIndex = keyword ? term.toLowerCase().indexOf(keyword) : -1}
	{#if matchIndex < 0}{term}{:else}{term.slice(0, matchIndex)}<mark
			class="bg-data-partly-achieved text-inherit"
			>{term.slice(matchIndex, matchIndex + keyword.length)}</mark
		>{term.slice(matchIndex + keyword.length)}{/if}
{/snippet}
