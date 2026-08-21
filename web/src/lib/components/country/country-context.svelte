<script lang="ts">
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import WarningAlt from 'carbon-icons-svelte/lib/WarningAlt.svelte';
	import type { Country } from '$lib/data/countries';

	interface Props {
		country: Country;
		variant?: 'light' | 'dark';
		class?: string;
	}

	const { country, variant = 'light', class: className }: Props = $props();

	const variantClasses = {
		light: 'text-gray-8',
		dark: 'text-white'
	};
</script>

<ul class={['space-y-1 b4', variantClasses[variant], className]}>
	<li>
		<strong>Government System:</strong>
		{country.governmentSystem}
		{#if country.governmentSystemRemark}
			{@render remark(country.governmentSystemRemark)}
		{/if}
	</li>
	<li>
		<strong>Parliamentary type:</strong>
		{country.parliamentType}
		{#if country.parliamentTypeRemark}
			{@render remark(country.parliamentTypeRemark)}
		{/if}
	</li>
	<li><strong>Parliament Name:</strong> {country.parliamentName}</li>
	<li>
		<strong>Parliament Official Website:</strong>
		{#if country.parliamentWebsites.length > 1}
			<ul class="list-disc pl-4 marker:text-gray-6">
				{#each country.parliamentWebsites as website (website)}
					<li>{@render websiteLink(website)}</li>
				{/each}
			</ul>
		{:else if country.parliamentWebsites.length}
			{@render websiteLink(country.parliamentWebsites[0])}
		{/if}
	</li>
</ul>

{#snippet remark(content: string)}
	<Tooltip size="big" triggerClass="align-middle">
		{#snippet trigger()}
			<WarningAlt size={18} class="-translate-y-0.5 text-purple-3 md:ml-0.5" />
		{/snippet}
		{content}
	</Tooltip>
{/snippet}

{#snippet websiteLink(website: string)}
	<Hyperlink
		href={website}
		target="_blank"
		color={variant === 'dark' ? 'white' : 'gray'}
		class="break-all"
	>
		{website}
	</Hyperlink>
{/snippet}
