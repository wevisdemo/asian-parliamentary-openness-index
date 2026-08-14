<script lang="ts">
	import { Combobox } from 'bits-ui';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';

	interface ComboboxOption {
		label: string;
		value: string;
	}

	interface Props {
		options: ComboboxOption[];
		value?: string[];
		placeholder?: string;
		color?: 'purple' | 'gray' | 'light';
		variant?: 'compact' | 'loose';
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

	const variantClasses = {
		compact: 'px-2 py-1 b4',
		loose: 'px-5 py-2.5'
	};

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
		},
		light: {
			trigger: 'border-gray-2 text-gray-2 hover:bg-gray-2 hover:text-black',
			triggerOpen: 'border-gray-2 bg-gray-2 text-black',
			panel: 'border-gray-2',
			option: 'text-black'
		}
	};

	let isOpen = $state(false);
	let search = $state('');
	let anchor = $state<HTMLElement | null>(null);

	const selectedLabels = $derived(
		options.filter((option) => value.includes(option.value)).map(({ label }) => label)
	);

	const summary = $derived(selectedLabels[0] ?? placeholder);

	const filteredOptions = $derived(
		options.filter(({ label }) => label.toLowerCase().includes(search.trim().toLowerCase()))
	);

	const styles = $derived(colorClasses[color]);
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
			'inline-flex items-center gap-2 border leading-none transition-colors',
			variantClasses[variant],
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
						class="field-sizing-content min-w-0 bg-transparent outline-none placeholder:text-current"
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
				'z-50 overflow-y-auto border bg-white',
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
							'flex cursor-pointer flex-row items-center gap-2 text-left b4 data-highlighted:bg-gray-1 data-highlighted:text-black',
							variantClasses[variant],
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
					<p class={['text-left b4 text-gray-6', variantClasses[variant]]}>No result</p>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
