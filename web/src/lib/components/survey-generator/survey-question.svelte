<script lang="ts">
	import {
		choiceKey,
		questionElementId,
		type SurveyDraft,
		type SurveyQuestion
	} from '$lib/data/survey';

	interface Props {
		question: SurveyQuestion;
		choices: SurveyDraft['choices'];
	}

	let { question, choices = $bindable() }: Props = $props();

	const multipleChoices = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' },
		{ label: 'N/A', value: 'n/a' }
	];
</script>

<div
	id={questionElementId(question)}
	class="flex scroll-mt-48 flex-col gap-3 border-l-4 border-gray-2 pl-4"
>
	<p class="b3 font-bold">{question.number}. {question.question}</p>

	{#each question.answerOptions.hints as hint (hint)}
		<p class="b4 text-gray-8">{hint}</p>
	{/each}

	{#if question.answerType === 'single'}
		<div class="flex flex-col gap-2">
			{#each [...question.answerOptions.options, { letter: 'n/a', text: 'N/A', score: undefined }] as { letter, text, score } (letter)}
				<label class="flex cursor-pointer items-start gap-2">
					<input
						type="radio"
						name={question.number}
						value={letter}
						bind:group={choices[choiceKey(question)]}
						class="mt-1 accent-purple-5"
					/>
					<span>
						{letter === 'n/a' ? text : `${letter}) ${text}`}
						{#if score !== undefined}<span class="text-gray-5">({score})</span>{/if}
					</span>
				</label>
			{/each}
		</div>
	{:else}
		<table class="w-full">
			<thead>
				<tr class="text-left b4 text-gray-8">
					<th class="py-1 font-normal">Option</th>
					{#each multipleChoices as { label } (label)}
						<th class="w-14 py-1 text-center font-normal">{label}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each question.answerOptions.options as { letter, text, score } (letter)}
					<tr class="border-t border-gray-2">
						<td class="py-2">{letter}) {text} <span class="text-gray-5">({score})</span></td>
						{#each multipleChoices as { label, value } (value)}
							<td class="text-center">
								<input
									type="radio"
									name={choiceKey(question, letter)}
									{value}
									aria-label={`${letter}) ${label}`}
									bind:group={choices[choiceKey(question, letter)]}
									class="accent-purple-5"
								/>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	{#if question.guidance}
		<details class="b4">
			<summary class="cursor-pointer text-purple-5">Guidance</summary>
			<p class="mt-2 whitespace-pre-line text-gray-8">{question.guidance}</p>
		</details>
	{/if}
</div>
