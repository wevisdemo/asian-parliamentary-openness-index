<script lang="ts">
	import type { Respondent } from '$lib/data/respondents';
	import TruncatableParagraph from '$lib/components/truncatable-paragraph.svelte';

	interface Props {
		respondent: Respondent;
	}

	const { respondent }: Props = $props();
</script>

<div
	class="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 border-t border-gray-2 pt-4 pb-6 lg:grid-cols-[auto_1fr_auto] lg:gap-x-6"
>
	<img
		src={respondent.organizationLogo}
		alt=""
		class="col-start-1 row-start-1 size-20 object-contain"
	/>
	<p class="col-start-2 row-start-1 text-right lg:col-start-3">
		{respondent.country}
	</p>
	<div
		class="col-span-2 col-start-1 row-start-2 flex flex-col gap-2 lg:col-span-1 lg:col-start-2 lg:row-start-1"
	>
		<h4 class="b2 font-bold">
			{respondent.organization ?? respondent.names?.join(', ')}
		</h4>
		{#if respondent.about}
			<TruncatableParagraph class="b4 whitespace-pre-line text-gray-8">
				{respondent.about}
			</TruncatableParagraph>
		{/if}
		{#if respondent.email}
			<p>{respondent.email}</p>
		{/if}
	</div>
</div>
