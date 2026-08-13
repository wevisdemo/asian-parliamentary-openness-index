<script lang="ts">
	import Button from './button.svelte';

	interface ActionLink {
		label: string;
		href: string;
	}

	interface Props {
		title: string;
		description: string;
		actions: ActionLink[];
		class?: string;
	}

	const { title, description, actions, class: className }: Props = $props();
</script>

<div
	class={[
		'flex flex-col gap-6 bg-purple-1 p-6 md:flex-row md:items-center md:justify-between md:gap-8',
		className
	]}
>
	<div class="flex flex-col gap-1">
		<p class="b1 font-bold">{title}</p>
		<p class="b2">{description}</p>
	</div>

	<div class="flex flex-col gap-2 md:shrink-0">
		{#each actions as { label, href } (href)}
			<Button {href}>{label}</Button>
		{/each}
	</div>
</div>
