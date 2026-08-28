<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { aboutSections } from '$lib/constants/about-sections';
	import Breadcrumb from './breadcrumb.svelte';
	import Button from './button.svelte';
	import Hyperlink from './hyperlink.svelte';
	import Modal from './modal.svelte';
	import Sharer from './sharer.svelte';

	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	interface Props {
		breadcrumbItems: BreadcrumbItem[];
		breadcrumbTrailing?: Snippet;
		showIndexInfo?: boolean;
		children?: Snippet;
		class?: string;
	}

	const {
		breadcrumbItems,
		breadcrumbTrailing,
		showIndexInfo = false,
		children,
		class: className
	}: Props = $props();

	let openModal = $state<'about' | 'methodology'>();
</script>

<div class={['relative flex flex-col', className]}>
	<Breadcrumb items={breadcrumbItems} trailing={breadcrumbTrailing} class="px-5 pt-4" />

	<div
		class={[
			'content-container flex flex-col gap-6 md:gap-8',
			!showIndexInfo && 'md:flex-row md:items-start md:justify-between'
		]}
	>
		{#if showIndexInfo}
			<div class="flex flex-col justify-between gap-2 md:flex-row">
				<div>
					<p class="b2 font-bold text-gray-8">
						Asian Parliamentary Openness Index {page.data.cycle.year}
					</p>
					<p class="b5 text-gray-6">Assessment Date: {page.data.cycle.assessmentDate}</p>
				</div>
				<div class="flex flex-row items-start gap-6 md:gap-8">
					<Hyperlink class="underline" onclick={() => (openModal = 'about')}>
						About the Index
					</Hyperlink>
					<Hyperlink class="underline" onclick={() => (openModal = 'methodology')}>
						Methodology
					</Hyperlink>
				</div>
			</div>
		{/if}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
			{@render children?.()}
		</div>
		<Sharer />
	</div>
</div>

<Modal open={openModal === 'about'} title="About the Index" onclose={() => (openModal = undefined)}>
	<p>
		The index assesses how openly national parliaments across Asia-Pacific operate, so citizens,
		media, and reformers can see exactly where each parliament stands. Every parliament is scored
		against the same set of questions, organized into three dimensions of openness: Transparency,
		Accountability, and Citizen Participation.
	</p>
	{@render seeMore(aboutSections[0].id)}
</Modal>

<Modal
	open={openModal === 'methodology'}
	title="Methodology"
	onclose={() => (openModal = undefined)}
>
	<p>
		The assessment covers 31 indicators across three dimensions. It is conducted independently every
		two years (first launched in 2026) by local PMOs or think tanks using only publicly available
		information, with the findings verified by academic experts.
	</p>
	{@render seeMore(aboutSections[1].id)}
</Modal>

{#snippet seeMore(sectionId: string)}
	<div class="flex justify-end">
		<Button href="{resolve('/about')}#{sectionId}" onclick={() => (openModal = undefined)}>
			See more
		</Button>
	</div>
{/snippet}
