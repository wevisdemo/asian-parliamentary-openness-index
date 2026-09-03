<script lang="ts">
	import Button from './button.svelte';

	interface ActionLink {
		label: string;
		href: string;
		target?: '_blank' | '_self';
	}

	interface Props {
		title: string;
		description: string;
		actions: ActionLink[];
		variant?: 'purple' | 'gray';
	}

	const { title, description, actions, variant = 'purple' }: Props = $props();

	const containerClasses = {
		purple: 'mt-6 bg-purple-1 md:mt-12',
		gray: 'mt-1 bg-gray-2'
	};

	const buttonVariants = {
		purple: 'primary',
		gray: 'secondary'
	} as const;
</script>

<div
	class="flex flex-col gap-2 p-6 md:flex-row md:justify-between md:gap-8 {containerClasses[
		variant
	]}"
>
	<div class="flex flex-col gap-1">
		<p class="b1 font-bold">{title}</p>
		<p class="b2">{description}</p>
	</div>

	<div class="flex flex-col items-start gap-2 md:shrink-0 md:items-stretch">
		{#each actions as { label, href, target } (href)}
			<Button {href} {target} variant={buttonVariants[variant]}>{label}</Button>
		{/each}
	</div>
</div>
