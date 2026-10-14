<script lang="ts">
	import Accordion from '$lib/components/accordion.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import QuestionAnswer from '$lib/components/assessment/question-answer.svelte';
	import type { Answer } from '$lib/data/answers';
	import type { Question } from '$lib/data/questions';
	import { formatLongDate } from '$lib/utils/date';
	import { quickFade } from '$lib/utils/transitions';

	interface Props {
		questions: Question[];
		answers: Answer[];
	}

	const { questions, answers }: Props = $props();

	const answerOf = (question: Question) =>
		answers.find(({ questionNumber }) => questionNumber === question.number);

	const readableUrl = (url: string) => {
		try {
			return decodeURI(url);
		} catch {
			return url;
		}
	};

	const accordionProps = {
		class: 'bg-purple-1',
		headerClass: 'px-3 py-2 hover:bg-purple-2',
		contentClass: 'px-3 pb-2 md:pb-4',
		iconClass: 'size-4 text-purple-5 mt-0.5'
	};
</script>

<div class="flex flex-1 flex-col gap-4">
	{#each questions as question, index (question.number)}
		{@const answer = answerOf(question)}
		<QuestionAnswer
			{question}
			{answer}
			class={index > 0 ? 'border-t-2 border-gray-2 pt-4' : undefined}
		/>

		{#if answer?.context || answer?.evidences.length}
			<div class="flex flex-col gap-2">
				{#if answer.context}
					<Accordion {...accordionProps}>
						{#snippet header()}
							<h4 class="text-left b4 font-bold">Country context</h4>
						{/snippet}

						{#snippet content()}
							{#key answer}
								<p in:quickFade class="ml-5 flex-1 whitespace-pre-line">{answer.context}</p>
							{/key}
						{/snippet}
					</Accordion>
				{/if}

				{#if answer.evidences.length}
					<Accordion {...accordionProps}>
						{#snippet header()}
							<h4 class="text-left b4 font-bold">Evidence sources</h4>
						{/snippet}

						{#snippet content()}
							{#key answer}
								<ul
									in:quickFade
									class="ml-5 flex flex-1 list-disc flex-col gap-1 pl-4 marker:text-gray-6"
								>
									{#each answer.evidences as { url, name, accessedDate } (url)}
										<li class="b4">
											<Hyperlink
												href={url}
												target="_blank"
												color="gray"
												class={name ? 'b4' : 'b4 break-all'}
											>
												{name ?? readableUrl(url)}
											</Hyperlink>
											{#if accessedDate}
												<span class="text-gray-6">(Accessed: {formatLongDate(accessedDate)})</span>
											{/if}
										</li>
									{/each}
								</ul>
							{/key}
						{/snippet}
					</Accordion>
				{/if}
			</div>
		{/if}
	{/each}
</div>
