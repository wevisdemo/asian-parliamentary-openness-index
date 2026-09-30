<script lang="ts">
	import type { Snippet } from 'svelte';
	import { radioClass } from '$lib/constants/control-styles';
	import { optionStates, type OptionState } from '$lib/constants/option-states';
	import {
		choiceKey,
		isAnswered,
		isUnscored,
		questionElementId,
		type SurveyDraft,
		type SurveyQuestion
	} from '$lib/data/survey';

	interface Props {
		question: SurveyQuestion;
		choices: SurveyDraft['choices'];
		dependency?: SurveyQuestion;
		children?: Snippet;
	}

	let { question, choices = $bindable(), dependency, children }: Props = $props();

	const optionStateLabels: Record<OptionState, string> = { yes: 'Yes', no: 'No', 'n/a': 'N/A' };

	const multipleChoices = optionStates.map((value) => ({ label: optionStateLabels[value], value }));
</script>

<div
	id={questionElementId(question)}
	class="flex scroll-mt-48 flex-col gap-3 border-l-4 border-gray-2 pl-4"
>
	<p class="b3 font-bold">{question.number}. {question.question}</p>

	{#each question.answerOptions.hints as hint (hint)}
		<p class="b4 text-gray-8">{hint}</p>
	{/each}

	{#if dependency && !isAnswered(dependency, choices)}
		<p class="b4 text-gray-7 italic">
			Answer {dependency.number} first, since this question is only scored where {dependency.number}
			scored above 0.
		</p>
	{:else if dependency && isUnscored(dependency, choices)}
		<p class="b4 text-gray-7 italic">
			Answered N/A, since this question is only scored where {dependency.number} scored above 0.
		</p>
	{:else if question.answerType === 'single'}
		<div class="flex flex-col gap-2">
			{#each [...question.answerOptions.options, { answer: 'n/a', text: 'N/A', score: undefined }] as { answer, text, score } (answer)}
				<label class="flex cursor-pointer items-start gap-2">
					<input
						type="radio"
						name={question.number}
						value={answer}
						bind:group={choices[choiceKey(question)]}
						class={['mt-1', radioClass]}
					/>
					<span>
						{answer === 'n/a' ? text : `${answer}) ${text}`}
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
				{#each question.answerOptions.options as { answer, text, score } (answer)}
					<tr class="border-t border-gray-2">
						<td class="py-2">{answer}) {text} <span class="text-gray-5">({score})</span></td>
						{#each multipleChoices as { label, value } (value)}
							<td class="text-center">
								<input
									type="radio"
									name={choiceKey(question, answer)}
									{value}
									aria-label={`${answer}) ${label}`}
									bind:group={choices[choiceKey(question, answer)]}
									class={radioClass}
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

	{@render children?.()}
</div>
