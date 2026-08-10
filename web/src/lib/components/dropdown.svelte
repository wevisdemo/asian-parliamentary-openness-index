<script lang="ts">
	import { Select } from 'bits-ui';
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

	const selectedLabel = $derived(options.find((option) => option.value === value)?.label);
	const styles = $derived(colorClasses[color]);
</script>

<Select.Root type="single" items={options} {value} onValueChange={onselect} bind:open={isOpen}>
	<Select.Trigger
		class={[
			'inline-flex cursor-pointer items-center justify-between gap-2 border px-2 py-1 b4 leading-none transition-colors',
			isOpen ? styles.triggerOpen : styles.trigger,
			className
		]}
	>
		{selectedLabel ?? placeholder}
		{#if isOpen}
			<ChevronUp size={16} />
		{:else}
			<ChevronDown size={16} />
		{/if}
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			sideOffset={4}
			collisionPadding={8}
			class={[
				'z-10 overflow-y-auto border bg-white',
				'max-h-(--bits-select-content-available-height) min-w-(--bits-select-anchor-width)',
				styles.panel
			]}
		>
			<Select.Viewport>
				{#each options as option (option.value)}
					<Select.Item
						value={option.value}
						label={option.label}
						class={[
							'cursor-pointer px-2 py-1 text-left b4 data-highlighted:bg-gray-1 data-highlighted:text-black',
							styles.option
						]}
					>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
