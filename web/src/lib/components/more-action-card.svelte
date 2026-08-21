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
	}

	const { title, description, actions }: Props = $props();
</script>

<div
	class="mt-6 flex flex-col gap-2 bg-purple-1 p-6 md:mt-12 md:flex-row md:justify-between md:gap-8"
>
	<div class="flex flex-col gap-1">
		<p class="b1 font-bold">{title}</p>
		<p class="b2">{description}</p>
	</div>

	<div class="flex flex-col items-start gap-2 md:shrink-0 md:items-stretch">
		{#each actions as { label, href } (href)}
			<Button {href}>{label}</Button>
		{/each}
	</div>
</div>
