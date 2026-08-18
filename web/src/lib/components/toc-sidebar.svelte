<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	interface TocItem {
		id: string;
		label: string;
	}

	interface Props {
		items: TocItem[];
		class?: string;
	}

	const { items, class: className }: Props = $props();

	let scrolledId = $state<string>();
	let clickedId = $state<string>();

	const activeId = $derived(clickedId ?? scrolledId ?? items[0]?.id);

	const updateActiveId = () => {
		const offset = window.innerHeight / 3;

		const passed = items.filter(({ id }) => {
			const top = document.getElementById(id)?.getBoundingClientRect().top;
			return top !== undefined && top <= offset;
		});

		scrolledId = passed.at(-1)?.id;

		if (clickedId === scrolledId) {
			clickedId = undefined;
		}
	};

	const trackActiveId: Attachment = () => updateActiveId();

	const scrollToSection = (event: MouseEvent, id: string) => {
		event.preventDefault();
		document.getElementById(id)?.scrollIntoView();
		clickedId = id;
	};
</script>

<svelte:window
	onscroll={updateActiveId}
	onscrollend={() => (clickedId = undefined)}
	onresize={updateActiveId}
/>

<nav class={['flex flex-col', className]} {@attach trackActiveId}>
	{#each items as { id, label } (id)}
		<a
			href="#{id}"
			onclick={(event) => scrollToSection(event, id)}
			class={[
				'border-l-4 px-4 py-2 b4 text-purple-5 hover:bg-purple-1',
				activeId === id ? 'border-purple-5 bg-purple-1 font-bold' : 'border-transparent'
			]}
		>
			{label}
		</a>
	{/each}
</nav>
