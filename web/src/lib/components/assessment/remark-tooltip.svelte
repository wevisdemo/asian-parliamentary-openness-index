<script lang="ts">
	import Tooltip from '$lib/components/tooltip.svelte';
	import WarningAlt from 'carbon-icons-svelte/lib/WarningAlt.svelte';

	interface Props {
		remark?: string;
	}

	const { remark }: Props = $props();
</script>

{#if remark}
	<Tooltip triggerClass="align-middle">
		{#snippet trigger()}
			<WarningAlt size={18} class="-translate-y-0.5 text-purple-3 md:ml-0.5" />
		{/snippet}
		{remark}
	</Tooltip>
{/if}
