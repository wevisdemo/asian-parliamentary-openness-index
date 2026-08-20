<script lang="ts" module>
	export interface TabOption<T extends string> {
		label: string;
		value: T;
		disabled?: boolean;
		colorClasses?: { default: string; selected: string };
	}
</script>

<script lang="ts" generics="T extends string">
	import { tick } from 'svelte';

	interface Props {
		options: TabOption<T>[];
		value?: T;
		variant?: 'primary' | 'secondary';
		sticky?: boolean;
		onselect?: (value: T) => void;
		class?: string;
	}

	const {
		options,
		value,
		variant = 'primary',
		sticky = false,
		onselect,
		class: className
	}: Props = $props();

	let element = $state<HTMLElement>();

	export const scrollToContent = async () => {
		await tick();

		const content = element?.nextElementSibling;

		if (!sticky || !element || !content) return;

		const stickyOffset = parseFloat(getComputedStyle(element).top) || 0;
		const contentGap = element.parentElement
			? parseFloat(getComputedStyle(element.parentElement).rowGap) || 0
			: 0;

		window.scrollTo({
			top:
				content.getBoundingClientRect().top +
				window.scrollY -
				element.offsetHeight -
				contentGap -
				stickyOffset,
			behavior: 'smooth'
		});
	};

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

	const stateOf = ({ value: optionValue, disabled }: TabOption<T>) =>
		disabled ? 'disabled' : optionValue === value ? 'selected' : 'default';

	const colorClassOf = (option: TabOption<T>) => {
		const state = stateOf(option);

		return state === 'disabled'
			? variantClasses[variant].disabled
			: (option.colorClasses?.[state] ?? variantClasses[variant][state]);
	};
</script>

{#snippet tablist(listClass?: string)}
	<div
		role="tablist"
		class={['flex flex-row', variant === 'secondary' && 'border-b-2 border-purple-5 ', listClass]}
	>
		{#each options as option (option.value)}
			<button
				type="button"
				role="tab"
				aria-selected={stateOf(option) === 'selected'}
				disabled={option.disabled}
				class={[
					'flex-1 px-4 py-2 text-center transition-colors md:py-3',
					variantClasses[variant].base,
					colorClassOf(option),
					option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
				]}
				onclick={() => onselect?.(option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
{/snippet}

{#if sticky}
	<div
		bind:this={element}
		class={[
			'sticky top-(--navbar-height) z-40 -mx-5 flex flex-1 overflow-x-scroll px-5 md:top-(--navbar-height-md) md:mx-0 md:overflow-visible md:px-0',
			className
		]}
	>
		{@render tablist('flex-1 whitespace-nowrap')}
	</div>
{:else}
	{@render tablist(className)}
{/if}
