<script lang="ts">
	import { Combobox } from 'bits-ui';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
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
		value?: string[];
		placeholder?: string;
		color?: SelectColor;
		variant?: SelectVariant;
		onselect?: (value: string[]) => void;
		class?: string;
	}

	const {
		options,
		value = [],
		placeholder = 'Select',
		color = 'purple',
		variant = 'loose',
		onselect,
		class: className
	}: Props = $props();

	let isOpen = $state(false);
	let search = $state('');
	let anchor = $state<HTMLElement | null>(null);

	const selectedLabels = $derived(
		options.filter((option) => value.includes(option.value)).map(({ label }) => label)
	);

	const summary = $derived(selectedLabels[0] ?? placeholder);

	const inputSize = $derived(Math.max((search || summary).length, 1));

	const filteredOptions = $derived(
		options.filter(({ label }) => label.toLowerCase().includes(search.trim().toLowerCase()))
	);

	const styles = $derived(selectColorClasses[color]);
</script>

<Combobox.Root
	type="multiple"
	items={options}
	{value}
	onValueChange={(selected) => {
		search = '';
		onselect?.(selected);
	}}
	bind:open={isOpen}
	onOpenChange={(open) => !open && (search = '')}
>
	<div
		bind:this={anchor}
		class={[
			selectTriggerClass,
			'max-w-full',
			triggerVariantClasses[variant],
			isOpen ? styles.triggerOpen : styles.trigger,
			className
		]}
	>
		<div class="flex min-w-0 flex-1 flex-row items-center gap-1">
			<Combobox.Input>
				{#snippet child({ props })}
					<input
						{...props}
						aria-label={placeholder}
						placeholder={summary}
						value={search}
						size={inputSize}
						class="field-sizing-content min-w-0 bg-transparent leading-none! outline-none placeholder:text-current"
						oninput={(event) => (search = event.currentTarget.value)}
					/>
				{/snippet}
			</Combobox.Input>

			{#if selectedLabels.length > 1}
				<span class="shrink-0">+{selectedLabels.length - 1}</span>
			{/if}
		</div>

		<Combobox.Trigger class="cursor-pointer" aria-label="Toggle options">
			{#if isOpen}
				<ChevronUp size={16} />
			{:else}
				<ChevronDown size={16} />
			{/if}
		</Combobox.Trigger>

		{#if selectedLabels.length}
			<button
				type="button"
				aria-label="Clear selection"
				class="cursor-pointer"
				onclick={() => {
					search = '';
					onselect?.([]);
				}}
			>
				<Close size={16} />
			</button>
		{/if}
	</div>

	<Combobox.Portal>
		<Combobox.Content
			customAnchor={anchor}
			sideOffset={4}
			collisionPadding={8}
			class={[
				selectContentClass,
				'max-h-(--bits-combobox-content-available-height) min-w-(--bits-combobox-anchor-width)',
				styles.panel
			]}
		>
			<Combobox.Viewport>
				{#each filteredOptions as option (option.value)}
					<Combobox.Item
						value={option.value}
						label={option.label}
						class={[
							selectItemClass,
							'flex flex-row items-center gap-2',
							itemVariantClasses[variant],
							styles.option
						]}
					>
						{#snippet children({ selected })}
							<span class="flex-1">{option.label}</span>
							{#if selected}
								<Checkmark size={16} class="shrink-0" />
							{/if}
						{/snippet}
					</Combobox.Item>
				{:else}
					<p class={['text-left text-gray-6', itemVariantClasses[variant]]}>No result</p>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
