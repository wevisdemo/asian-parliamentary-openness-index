<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		color?: 'purple' | 'gray' | 'white';
		target?: '_blank' | '_self';
		type?: 'button' | 'submit';
		icon?: Snippet;
		children: Snippet;
		onclick?: (event: MouseEvent) => void;
		class?: string;
	}

	const {
		href,
		color = 'purple',
		target,
		type = 'button',
		icon,
		children,
		onclick,
		class: className
	}: Props = $props();

	const colorClasses = {
		purple: 'text-purple-5 hover:text-gray-8',
		gray: 'text-gray-8 hover:text-purple-5',
		white: 'text-white hover:text-purple-3'
	};

	const classes = $derived([
		'inline-flex cursor-pointer items-center gap-1 b4',
		colorClasses[color],
		!icon && 'underline',
		className
	]);
</script>

{#if href}
	<a {href} {target} rel={target === '_blank' ? 'noreferrer' : undefined} class={classes} {onclick}>
		{@render children()}
		{@render icon?.()}
	</a>
{:else}
	<button {type} class={classes} {onclick}>
		{@render children()}
		{@render icon?.()}
	</button>
{/if}
