<script lang="ts">
	import { resolve } from '$app/paths';
	import MoreActionCard from './more-action-card.svelte';
</script>

<MoreActionCard
	title="Conduct deeper analysis"
	description="Machine-readable data for all countries in this cycle is available for download."
	actions={[{ label: 'Download raw data', href: resolve('/downloads') }]}
/>
