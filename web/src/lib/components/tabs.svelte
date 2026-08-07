<script lang="ts" generics="T extends string">
	interface TabOption {
		label: string;
		value: T;
		disabled?: boolean;
	}

	interface Props {
		options: TabOption[];
		value?: T;
		variant?: 'primary' | 'secondary';
		onselect?: (value: T) => void;
		class?: string;
	}

	const { options, value, variant = 'primary', onselect, class: className }: Props = $props();

	const variantClasses = {
		primary: {
			base: 'b1 border-2',
			default: 'border-purple-5 text-purple-5 hover:bg-purple-1',
			selected: 'border-purple-5 bg-purple-5 font-bold text-white',
			disabled: 'border-gray-2 text-gray-3'
		},
		secondary: {
			base: 'b2 border-b-2',
			default: 'border-transparent text-purple-5 hover:bg-purple-1',
			selected: 'border-b-2 border-purple-5 font-bold text-purple-5',
			disabled: 'border-gray-2 text-gray-3'
		}
	};

	const stateOf = ({ value: optionValue, disabled }: TabOption) =>
		disabled ? 'disabled' : optionValue === value ? 'selected' : 'default';
</script>

<div
	role="tablist"
	class={['flex flex-row', variant === 'secondary' && 'border-b-2 border-purple-5 ', className]}
>
	{#each options as option (option.value)}
		<button
			type="button"
			role="tab"
			aria-selected={stateOf(option) === 'selected'}
			disabled={option.disabled}
			class={[
				'flex-1 px-4 py-2 text-center transition-colors md:py-4',
				variantClasses[variant].base,
				variantClasses[variant][stateOf(option)],
				option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
			]}
			onclick={() => onselect?.(option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>
