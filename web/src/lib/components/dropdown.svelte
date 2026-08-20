<script lang="ts">
	import { Select } from 'bits-ui';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
	import {
		itemVariantClasses,
		selectColorClasses,
		selectContentClass,
		selectItemClass,
		selectTriggerClass,
		triggerVariantClasses,
		type SelectColor,
		type SelectOption,
		type SelectVariant
	} from '$lib/constants/control-styles';

	interface Props {
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		color?: SelectColor;
		variant?: SelectVariant;
		onselect?: (value: string) => void;
		class?: string;
	}

	const {
		options,
		value,
		placeholder = 'Select',
		color = 'purple',
		variant = 'loose',
		onselect,
		class: className
	}: Props = $props();

	let isOpen = $state(false);

	const selectedLabel = $derived(options.find((option) => option.value === value)?.label);
	const styles = $derived(selectColorClasses[color]);
</script>

<Select.Root type="single" items={options} {value} onValueChange={onselect} bind:open={isOpen}>
	<Select.Trigger
		class={[
			selectTriggerClass,
			'cursor-pointer justify-between',
			triggerVariantClasses[variant],
			isOpen ? styles.triggerOpen : styles.trigger,
			className
		]}
	>
		<span class="min-w-0 truncate">{selectedLabel ?? placeholder}</span>
		{#if isOpen}
			<ChevronUp size={16} class="shrink-0" />
		{:else}
			<ChevronDown size={16} class="shrink-0" />
		{/if}
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			sideOffset={4}
			collisionPadding={8}
			class={[
				selectContentClass,
				'max-h-(--bits-select-content-available-height) min-w-(--bits-select-anchor-width)',
				styles.panel
			]}
		>
			<Select.Viewport>
				{#each options as option (option.value)}
					<Select.Item
						value={option.value}
						label={option.label}
						class={[selectItemClass, itemVariantClasses[variant], styles.option]}
					>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
