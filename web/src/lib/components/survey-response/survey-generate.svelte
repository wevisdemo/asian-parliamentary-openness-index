<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import { chamberOptions } from '$lib/constants/chambers';
	import { inputClass, radioClass } from '$lib/constants/control-styles';
	import {
		formatSurveyCsv,
		surveyFileBaseName,
		surveyFileName,
		type SurveyDraft,
		type SurveyQuestion
	} from '$lib/data/survey';

	interface IncompleteStep {
		index: number;
		name: string;
		unanswered: SurveyQuestion[];
		incompleteReferences: SurveyQuestion[];
	}

	interface Props {
		questions: SurveyQuestion[];
		draft: SurveyDraft;
		incompleteSteps: IncompleteStep[];
		onstep: (index: number) => void;
	}

	let { questions, draft = $bindable(), incompleteSteps, onstep }: Props = $props();

	const download = () => {
		const url = URL.createObjectURL(
			new Blob([formatSurveyCsv(questions, draft)], { type: 'text/csv' })
		);
		const link = document.createElement('a');

		link.href = url;
		link.download = surveyFileName(draft, new Date());
		link.click();
		setTimeout(() => URL.revokeObjectURL(url));
	};
</script>

<h2 class="h3 font-bold">Generate CSV</h2>

<div class="flex flex-col gap-4">
	<h3 class="b2 font-bold">Missing items</h3>

	{#each incompleteSteps as { index, name, unanswered, incompleteReferences } (name)}
		<div class="flex flex-col gap-1">
			<Hyperlink class="self-start b3 font-bold" onclick={() => onstep(index)}>
				{name}
			</Hyperlink>
			{#if unanswered.length > 0}
				<p>
					Unanswered questions: {unanswered.map((question) => question.number).join(', ')}
				</p>
			{/if}
			{#if incompleteReferences.length > 0}
				<p>
					Incomplete references in questions: {incompleteReferences
						.map((question) => question.number)
						.join(', ')}
				</p>
			{/if}
		</div>
	{:else}
		<p>All questions are answered and all references are complete.</p>
	{/each}
</div>

<div class="flex flex-col gap-4 bg-gray-1 p-6">
	<label class="flex flex-col gap-1">
		<span class="b4 font-bold">Country</span>
		<input type="text" bind:value={draft.country} class={[inputClass, 'md:w-96']} />
	</label>

	<fieldset class="flex flex-col gap-1">
		<legend class="b4 font-bold">Chamber</legend>
		<div class="flex gap-6">
			{#each chamberOptions as { label, value } (value)}
				<label class="flex cursor-pointer items-center gap-2">
					<input
						type="radio"
						name="chamber"
						{value}
						bind:group={draft.chamber}
						class={radioClass}
					/>
					{label}
				</label>
			{/each}
		</div>
	</fieldset>

	<p class="b4 text-gray-8">
		File name: {draft.country.trim()
			? `${surveyFileBaseName(draft)}-<download date and time>.csv`
			: '-'}
	</p>

	<Button class="self-start" disabled={!draft.country.trim()} onclick={download}>
		Download CSV
	</Button>
</div>
