<script lang="ts">
	import Accordion from '$lib/components/accordion.svelte';
	import Button from '$lib/components/button.svelte';
	import { inputClass } from '$lib/constants/control-styles';
	import { isReferenceComplete, type SurveyDraft } from '$lib/data/survey';

	interface Props {
		questionNumber: string;
		draft: SurveyDraft;
	}

	let { questionNumber, draft = $bindable() }: Props = $props();

	const references = $derived(draft.references[questionNumber] ?? []);

	const summary = $derived(
		[
			draft.contexts[questionNumber]?.trim() ? 'Context added' : 'No context',
			`${references.length} ${references.length === 1 ? 'reference' : 'references'}`
		].join(', ')
	);

	const addReference = () => {
		draft.references[questionNumber] = [
			...references,
			{ websiteName: '', url: '', accessedDate: '' }
		];
	};

	const removeReference = (index: number) => {
		draft.references[questionNumber] = references.filter((_, i) => i !== index);
	};
</script>

<Accordion class="bg-gray-1" headerClass="p-4 hover:bg-gray-2 text-left" contentClass="px-4 pb-4">
	{#snippet header()}
		<span class="b4 font-bold">Country context and references</span>
		<span class="b5 text-gray-8">({summary})</span>
	{/snippet}

	{#snippet content()}
		<div class="flex flex-1 flex-col gap-4">
			<label class="flex flex-col gap-1">
				<span class="b4 font-bold">Country context for this question</span>
				<span class="b5 text-gray-8">
					Briefly explain why this response was selected, including any relevant country or
					parliamentary context used to support the assessment, where appropriate. This explanation
					will be publicly available, so please provide sufficient context for a third party who is
					not familiar with the Parliament or its processes to understand why the response is
					appropriate.
				</span>
				<textarea rows="4" bind:value={draft.contexts[questionNumber]} class={inputClass}
				></textarea>
			</label>

			<div class="flex flex-col gap-2">
				<p class="b4 font-bold">References</p>
				<p class="b5 text-gray-8">
					List every source you used to support your answer. Each reference needs a source name, a
					URL starting with http:// or https://, and a last accessed date.
				</p>

				{#each references as reference, index (index)}
					<fieldset
						class={[
							'flex flex-col gap-2 border bg-white p-3 md:flex-row md:items-end',
							isReferenceComplete(reference) ? 'border-gray-2' : 'border-data-not-achieved'
						]}
					>
						<legend class="px-1 b5 text-gray-8">Reference {index + 1}</legend>
						<label class="flex flex-1 flex-col gap-1">
							<span class="b5">Source name</span>
							<input
								type="text"
								bind:value={reference.websiteName}
								placeholder="Official/public known name of website or document"
								class={inputClass}
							/>
						</label>
						<label class="flex flex-1 flex-col gap-1">
							<span class="b5">URL</span>
							<input type="url" bind:value={reference.url} class={inputClass} />
						</label>
						<label class="flex flex-col gap-1">
							<span class="b5">Last accessed date</span>
							<input type="date" bind:value={reference.accessedDate} class={inputClass} />
						</label>
						<Button variant="secondary" size="small" onclick={() => removeReference(index)}>
							Remove
						</Button>
					</fieldset>
				{/each}

				<Button variant="secondary" size="small" class="self-start" onclick={addReference}>
					Add reference
				</Button>
			</div>
		</div>
	{/snippet}
</Accordion>
