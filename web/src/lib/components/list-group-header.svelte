<script lang="ts">
	interface Props {
		name: string;
		postfix?: string;
		description?: string;
		class?: string;
	}

	const { name, postfix, description, class: className }: Props = $props();
</script>

<div class={['flex flex-col border-t-2 border-gray-6 pt-4 b4 text-gray-6', className]}>
	<h4>
		<span class="font-bold text-gray-8">{name}</span>
		{#if postfix}
			<span>{postfix}</span>
		{/if}
	</h4>
	{#if description}
		<p>{description}</p>
	{/if}
</div>
