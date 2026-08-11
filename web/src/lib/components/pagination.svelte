<script lang="ts" generics="T extends string">
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	interface PaginationOption {
		label: string;
		value: T;
	}

	interface Props {
		options: PaginationOption[];
		value?: T;
		onselect?: (value: T) => void;
		class?: string;
	}

	const { options, value, onselect, class: className }: Props = $props();

	const directions = {
		previous: { label: 'Previous', icon: ArrowLeft, classes: 'text-left' },
		next: { label: 'Next', icon: ArrowRight, classes: 'ml-auto flex-row-reverse text-right' }
	};

	const selectedIndex = $derived(options.findIndex((option) => option.value === value));

	const previous = $derived(selectedIndex > 0 ? options[selectedIndex - 1] : undefined);
	const next = $derived(selectedIndex >= 0 ? options[selectedIndex + 1] : undefined);
</script>

{#snippet step(option: PaginationOption, direction: keyof typeof directions)}
	{@const { label, icon: Icon, classes } = directions[direction]}
	<button
		type="button"
		class={['group flex cursor-pointer flex-row items-start gap-1', classes]}
		onclick={() => onselect?.(option.value)}
	>
		<Icon size={18} class="shrink-0 text-gray-6 md:mt-0.5" />
		<span class="flex flex-col">
			<span class="b4 text-gray-6">{label}</span>
			<span class="b2 font-bold text-purple-5 transition-colors group-hover:text-gray-8">
				{option.label}
			</span>
		</span>
	</button>
{/snippet}

{#if previous || next}
	<div class={['flex flex-row items-start justify-between gap-4', className]}>
		{#if previous}
			{@render step(previous, 'previous')}
		{/if}

		{#if next}
			{@render step(next, 'next')}
		{/if}
	</div>
{/if}
