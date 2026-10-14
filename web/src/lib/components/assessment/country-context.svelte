<script lang="ts">
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import RemarkTooltip from '$lib/components/assessment/remark-tooltip.svelte';
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

	const websites = $derived(country.parliamentWebsites.answer);
</script>

<ul class={['b4', variantClasses[variant], className]}>
	<li>
		<strong>Government system:</strong>
		{country.governmentSystem.answer}
		<RemarkTooltip remark={country.governmentSystem.remark} />
	</li>
	<li>
		<strong>Parliamentary type:</strong>
		{country.parliamentType.answer}
		<RemarkTooltip remark={country.parliamentType.remark} />
	</li>
	<li>
		<strong>Parliament name:</strong>
		{country.parliamentName.answer}
		<RemarkTooltip remark={country.parliamentName.remark} />
	</li>
	<li>
		<strong>Parliament official website:</strong>
		{#if websites.length > 1}
			<RemarkTooltip remark={country.parliamentWebsites.remark} />
			<ul class="list-disc pl-4 marker:text-gray-6">
				{#each websites as website (website)}
					<li>{@render websiteLink(website)}</li>
				{/each}
			</ul>
		{:else}
			{#if websites.length}
				{@render websiteLink(websites[0])}
			{/if}
			<RemarkTooltip remark={country.parliamentWebsites.remark} />
		{/if}
	</li>
</ul>

{#snippet websiteLink(website: string)}
	<Hyperlink
		href={website}
		target="_blank"
		color={variant === 'dark' ? 'white' : 'gray'}
		class="b4 break-all"
	>
		{website}
	</Hyperlink>
{/snippet}
