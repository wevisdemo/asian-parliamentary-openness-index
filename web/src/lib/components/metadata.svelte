<script lang="ts">
	const SITE_NAME = 'Asian Parliamentary Openness Index';

	interface Props {
		page?: string;
	}

	const { page }: Props = $props();
</script>

<svelte:head>
	<title>{page ? `${page} · ${SITE_NAME}` : SITE_NAME}</title>
</svelte:head>
