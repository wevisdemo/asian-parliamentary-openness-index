<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		size?: 'big' | 'small';
		disabled?: boolean;
		href?: string;
		type?: 'button' | 'submit';
		icon?: Snippet;
		children: Snippet;
		onclick?: (event: MouseEvent) => void;
		class?: string;
	}

	const {
		variant = 'primary',
		size = 'big',
		disabled = false,
		href,
		type = 'button',
		icon,
		children,
		onclick,
		class: className
	}: Props = $props();

	const sizeClasses = {
		big: 'b3 gap-3 px-5 py-2.5',
		small: 'b5 gap-2 px-4 py-1.5'
	};

	const variantClasses = {
		primary: {
			enabled: 'bg-purple-5 text-white hover:bg-black',
			disabled: 'bg-gray-2 text-gray-4'
		},
		secondary: {
			enabled: 'border border-purple-5 text-purple-5 hover:border-purple-4 hover:bg-purple-1',
			disabled: 'border border-gray-2 text-gray-3'
		}
	};

	const classes = $derived([
		'inline-flex items-center justify-center font-medium transition-colors',
		sizeClasses[size],
		variantClasses[variant][disabled ? 'disabled' : 'enabled'],
		disabled ? 'cursor-not-allowed' : 'cursor-pointer',
		className
	]);
</script>

{#if href}
	<a href={disabled ? undefined : href} aria-disabled={disabled} class={classes} {onclick}>
		{@render children()}
		{@render icon?.()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {onclick}>
		{@render children()}
		{@render icon?.()}
	</button>
{/if}
