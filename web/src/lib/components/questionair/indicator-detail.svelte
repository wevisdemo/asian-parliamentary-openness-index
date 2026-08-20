<script lang="ts">
	import Accordion from '$lib/components/accordion.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import QuestionAnswer from '$lib/components/questionair/question-answer.svelte';
	import type { Answer } from '$lib/data/answers';
	import type { IndicatorContext } from '$lib/data/indicator-contexts';
	import type { Question } from '$lib/data/questions';
	import { quickFade } from '$lib/utils/transitions';

	interface Props {
		questions: Question[];
		answers: Answer[];
		context?: IndicatorContext;
		class?: string;
	}

	const { questions, answers, context, class: className }: Props = $props();

	const answerOf = (question: Question) =>
		answers.find(({ questionNumber }) => questionNumber === question.number);
</script>

<div class={['flex flex-1 flex-col gap-4', className]}>
	{#each questions as question, index (question.number)}
		<QuestionAnswer
			{question}
			answer={answerOf(question)}
			class={index > 0 ? 'border-t-2 border-gray-2 pt-4' : undefined}
		/>
	{/each}

	<div class="flex flex-col gap-2">
		{#if context?.context}
			<Accordion
				class="bg-purple-1"
				headerClass="p-4 hover:bg-purple-2 md:p-6"
				contentClass="p-4 pt-0 md:px-6 md:pb-6"
			>
				{#snippet header()}
					<h4 class="text-left b4 font-bold">Country context</h4>
				{/snippet}

				{#snippet content()}
					{#key context}
						<p in:quickFade class="ml-7 flex-1 whitespace-pre-line md:mt-2">{context.context}</p>
					{/key}
				{/snippet}
			</Accordion>
		{/if}

		{#if context?.evidences.length}
			<Accordion
				class="bg-purple-1"
				headerClass="p-4 hover:bg-purple-2 md:p-6"
				contentClass="p-4 pt-0 md:px-6 md:pb-6"
			>
				{#snippet header()}
					<h4 class="text-left b4 font-bold">Evidence sources</h4>
				{/snippet}

				{#snippet content()}
					{#key context}
						<ul
							in:quickFade
							class="ml-7 flex flex-1 list-disc flex-col gap-1 pl-4 marker:text-gray-6 md:mt-2"
						>
							{#each context.evidences as evidence (evidence)}
								<li>
									<Hyperlink
										href={evidence}
										target="_blank"
										color="gray"
										class="b4 break-all underline"
									>
										{evidence}
									</Hyperlink>
								</li>
							{/each}
						</ul>
					{/key}
				{/snippet}
			</Accordion>
		{/if}
	</div>
</div>
