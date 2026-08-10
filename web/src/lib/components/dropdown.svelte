<script lang="ts">
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';

	interface DropdownOption {
		label: string;
		value: string;
	}

	interface Props {
		options: DropdownOption[];
		value?: string;
		placeholder?: string;
		color?: 'purple' | 'gray';
		onselect?: (value: string) => void;
		class?: string;
	}

	const {
		options,
		value,
		placeholder = 'Select',
		color = 'purple',
		onselect,
		class: className
	}: Props = $props();

	const colorClasses = {
		purple: {
			trigger: 'border-purple-5 text-purple-5 hover:bg-purple-5 hover:text-white',
			triggerOpen: 'border-purple-5 bg-purple-5 text-white',
			panel: 'border-purple-5',
			option: 'text-purple-5'
		},
		gray: {
			trigger: 'border-gray-8 text-gray-8 hover:bg-gray-8 hover:text-white',
			triggerOpen: 'border-gray-8 bg-gray-8 text-white',
			panel: 'border-gray-8',
			option: 'text-gray-8'
		}
	};

	let isOpen = $state(false);
	let container = $state<HTMLDivElement>();

	const selectedLabel = $derived(options.find((option) => option.value === value)?.label);
	const styles = $derived(colorClasses[color]);

	const select = (option: DropdownOption) => {
		isOpen = false;
		onselect?.(option.value);
	};

	const closeOnOutsideClick = ({ target }: MouseEvent) => {
		if (isOpen && target instanceof Node && !container?.contains(target)) isOpen = false;
	};
</script>

<svelte:document
	onclick={closeOnOutsideClick}
	onkeydown={({ key }) => key === 'Escape' && (isOpen = false)}
/>

<div bind:this={container} class={['relative inline-block', className]}>
	<button
		type="button"
		aria-expanded={isOpen}
		class={[
			'inline-flex w-full cursor-pointer items-center justify-between gap-2 border px-2 py-1 b4 leading-none transition-colors',
			isOpen ? styles.triggerOpen : styles.trigger
		]}
		onclick={() => (isOpen = !isOpen)}
	>
		{selectedLabel ?? placeholder}
		{#if isOpen}
			<ChevronUp size={16} />
		{:else}
			<ChevronDown size={16} />
		{/if}
	</button>

	{#if isOpen}
		<ul
			class={[
				'absolute top-full left-0 z-10 mt-1 max-h-80 min-w-48 overflow-y-auto border bg-white',
				styles.panel
			]}
		>
			{#each options as option (option.value)}
				<li>
					<button
						type="button"
						class={[
							'w-full cursor-pointer px-2 py-1 text-left b4 hover:bg-gray-1 hover:text-black',
							styles.option
						]}
						onclick={() => select(option)}
					>
						{option.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
