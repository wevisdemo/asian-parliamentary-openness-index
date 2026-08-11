<script lang="ts">
	import type { Respondent } from '$lib/data/respondents';

	interface Props {
		respondent: Respondent;
		class?: string;
	}

	const { respondent, class: className }: Props = $props();
</script>

<div class={['grid grid-cols-1 gap-4 text-gray-8 md:grid-cols-2 md:gap-8', className]}>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-1">
			<h3 class="font-bold">{respondent.organization}</h3>
			{#if respondent.about}
				<p class="whitespace-pre-line">{respondent.about}</p>
			{/if}
		</div>

		<div class="flex flex-col gap-1">
			<p class="b4 text-gray-6">Years of experience of parliament monitoring by the organization</p>
			<p>{respondent.yearsOfExperience}</p>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-1">
			<p class="b4 text-gray-6">Name of respondent</p>
			<ul class="list-disc pl-5">
				{#each respondent.names as name (name)}
					<li>{name}</li>
				{/each}
			</ul>
		</div>
		<div class="flex flex-col gap-1">
			<p class="b4 text-gray-6">Email of respondent to correspond with</p>
			<p>{respondent.email}</p>
		</div>
	</div>
</div>
