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
		purple: 'text-purple-5',
		gray: 'text-gray-8',
		white: 'text-white'
	};

	const classes = $derived([
		'inline-flex cursor-pointer items-center gap-1 b4 hover:underline',
		colorClasses[color],
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
