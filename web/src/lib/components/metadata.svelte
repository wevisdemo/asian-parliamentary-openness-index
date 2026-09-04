<script lang="ts">
	import ogFile from '$lib/assets/og.png';
	import { siteName, siteTagline, siteUrl } from '$lib/constants/site';

	interface Props {
		page?: string;
	}

	const { page }: Props = $props();

	const title = $derived(page ? `${page} - ${siteName}` : siteName);
	const ogImage = `${siteUrl}${ogFile}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={siteTagline} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={siteTagline} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
