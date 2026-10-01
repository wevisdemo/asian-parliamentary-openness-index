<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		aboutSections,
		aboutTheIndexSummary,
		getMethodologyBrief
	} from '$lib/constants/about-sections';
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
					<p class="b5 text-gray-6">Assessment date: {page.data.cycle.assessmentDate}</p>
				</div>
				<div class="flex flex-row items-start gap-6 md:gap-8">
					<Hyperlink class="b4" onclick={() => (openModal = 'about')}>About the Index</Hyperlink>
					<Hyperlink class="b4" onclick={() => (openModal = 'methodology')}>Methodology</Hyperlink>
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
	<p>{aboutTheIndexSummary}</p>
	{@render seeMore(aboutSections[0].id)}
</Modal>

<Modal
	open={openModal === 'methodology'}
	title="Methodology"
	onclose={() => (openModal = undefined)}
>
	<p class="whitespace-pre-line">
		{getMethodologyBrief({
			indicatorCount: page.data.indicatorCount,
			questionCount: page.data.questionCount,
			firstCycleYear: page.data.cycle.year
		})}
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
