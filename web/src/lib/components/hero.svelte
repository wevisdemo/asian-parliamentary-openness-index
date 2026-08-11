<script lang="ts">
	import type { Snippet } from 'svelte';
	import Breadcrumb from './breadcrumb.svelte';
	import Hyperlink from './hyperlink.svelte';
	import Modal from './modal.svelte';

	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	interface Props {
		breadcrumbItems: BreadcrumbItem[];
		breadcrumbTrailing?: Snippet;
		children?: Snippet;
		class?: string;
	}

	const { breadcrumbItems, breadcrumbTrailing, children, class: className }: Props = $props();

	let openModal = $state<'about' | 'methodology'>();
</script>

<div class={['relative flex flex-col px-5 py-4', className]}>
	<Breadcrumb items={breadcrumbItems} trailing={breadcrumbTrailing} />

	<div class="content-container flex flex-col gap-6 py-12 md:py-16">
		<div class="flex flex-col justify-between gap-2 md:flex-row">
			<div>
				<p class="b2 font-bold text-gray-8">Asia Parliamentary Openness Index 2026</p>
				<p class="b5 text-gray-6">Assessment Date: August 2026</p>
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
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
			{@render children?.()}
		</div>
	</div>
</div>

<Modal open={openModal === 'about'} title="About the Index" onclose={() => (openModal = undefined)}>
	<p>
		The index assesses how openly national parliaments across Asia-Pacific operate, so citizens,
		media, and reformers can see exactly where each parliament stands. Every parliament is scored
		against the same set of questions, organized into three dimensions of openness: Transparency,
		Accountability, and Citizen Participation.
	</p>
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
</Modal>
