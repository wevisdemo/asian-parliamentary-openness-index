<script lang="ts">
	import TruncatableParagraph from '$lib/components/truncatable-paragraph.svelte';

	interface Props {
		name: string;
		logo?: string;
		description?: string;
		caption?: string;
		contact?: string;
	}

	const { name, logo, description, caption, contact }: Props = $props();
</script>

<div
	class="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 border-t border-gray-2 pt-4 pb-6 lg:grid-cols-[auto_1fr_auto] lg:gap-x-6"
>
	<img src={logo} alt="" class="col-start-1 row-start-1 size-20 object-contain" />
	{#if caption}
		<p class="col-start-2 row-start-1 text-right lg:col-start-3">{caption}</p>
	{/if}
	<div
		class="col-span-2 col-start-1 row-start-2 flex flex-col gap-2 lg:col-span-1 lg:col-start-2 lg:row-start-1"
	>
		<h4 class="b2 font-bold">{name}</h4>
		{#if description}
			<TruncatableParagraph class="b4 whitespace-pre-line text-gray-8">
				{description}
			</TruncatableParagraph>
		{/if}
		{#if contact}
			<p>{contact}</p>
		{/if}
	</div>
</div>
