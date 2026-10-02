<script lang="ts">
	import type { Snippet } from 'svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
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

{#snippet naLabel()}
	<Tooltip>
		{#snippet trigger()}
			N/A
			<Information size={16} class="text-purple-3" />
		{/snippet}
		<div class="flex flex-col gap-2">
			<p class="font-bold">N/A: what it means and how to use it</p>
			<p>
				N/A (not applicable) stays on the questions, but it is not a way to score a question when we
				have no answer option for the situation. It means the thing asked about does not exist in
				this parliament's system, as with MP allowances or pensions. Where a parliament lacks
				something it is expected to have or publish, or no option fits cleanly, the assessor selects
				the most suitable option and explains the choice under Country context.
			</p>
			<p class="font-bold">When N/A is wrong</p>
			<ul class="list-disc pl-5">
				<li>
					The information cannot be found, or is not published. Select "Not available" or the lowest
					option.
				</li>
				<li>
					No option fits exactly. Select the closest one and explain why under Country context.
				</li>
			</ul>
			<p>
				<span class="font-bold">Reason required.</span> Any N/A needs a one-line reason in the context
				box.
			</p>
		</div>
	</Tooltip>
{/snippet}

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
						{#if answer === 'n/a'}
							{@render naLabel()}
						{:else}
							{answer}) {text}
						{/if}
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
					{#each multipleChoices as { label, value } (value)}
						<th class="w-14 py-1 text-center font-normal">
							{#if value === 'n/a'}{@render naLabel()}{:else}{label}{/if}
						</th>
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
