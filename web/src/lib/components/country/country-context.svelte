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
	<li><strong>Government System:</strong> {country.governmentSystem}</li>
	<li>
		<strong>Parliamentary type:</strong>
		{country.parliamentType}
		{#if country.parliamentTypeRemark}
			<Tooltip size="big" triggerClass="align-middle">
				{#snippet trigger()}
					<WarningAlt size={18} class="-translate-y-0.5 text-purple-3 md:ml-0.5" />
				{/snippet}
				{country.parliamentTypeRemark}
			</Tooltip>
		{/if}
	</li>
	<li><strong>Parliament Name:</strong> {country.parliamentName}</li>
	<li>
		<strong>Parliament Official Website:</strong>
		<Hyperlink
			href={country.parliamentWebsite}
			target="_blank"
			color={variant === 'dark' ? 'white' : 'gray'}
			class="break-all"
		>
			{country.parliamentWebsite}
		</Hyperlink>
	</li>
</ul>
