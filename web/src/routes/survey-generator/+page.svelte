<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/button.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import TocSidebar from '$lib/components/toc-sidebar.svelte';
	import SurveyEvidence from '$lib/components/survey-generator/survey-evidence.svelte';
	import SurveyQuestion from '$lib/components/survey-generator/survey-question.svelte';
	import SurveyStatusIcon from '$lib/components/survey-generator/survey-status-icon.svelte';
	import { chambers } from '$lib/constants/chambers';
	import {
		createSurveyDraft,
		formatSurveyCsv,
		groupSurveyQuestions,
		isAnswered,
		isReferenceComplete,
		parseSurveyCsv,
		questionElementId,
		type SurveyDraft
	} from '$lib/data/survey';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const storageKey = 'apoi-survey-generator-draft';
	const saveDelay = 1000;

	const dimensions = $derived(groupSurveyQuestions(data.questions));

	let draft = $state<SurveyDraft>(createSurveyDraft());
	let step = $state(0);
	let savedDraft = $state<string>();
	let saveFailed = $state(false);

	const serializedDraft = $derived(JSON.stringify(draft));

	const saveStatus = $derived.by(() => {
		if (savedDraft === undefined) {
			return 'Loading saved answers…';
		}

		if (saveFailed) {
			return 'Could not save, the browser storage may be full';
		}

		return serializedDraft === savedDraft ? 'All changes saved' : 'Saving…';
	});

	const save = () => {
		if (savedDraft === undefined || serializedDraft === savedDraft) {
			return;
		}

		try {
			localStorage.setItem(storageKey, serializedDraft);
			savedDraft = serializedDraft;
			saveFailed = false;
		} catch {
			saveFailed = true;
		}
	};

	onMount(() => {
		const stored = localStorage.getItem(storageKey);

		try {
			if (stored) {
				draft = { ...createSurveyDraft(), ...JSON.parse(stored) };
			}
		} catch {
			alert('Could not read the saved answers, starting with an empty survey.');
		}

		savedDraft = serializedDraft;

		return save;
	});

	$effect(() => {
		if (serializedDraft === savedDraft) {
			return;
		}

		const timeout = setTimeout(save, saveDelay);

		return () => clearTimeout(timeout);
	});

	const reset = () => {
		if (!confirm('Reset all answers? This cannot be undone.')) {
			return;
		}

		localStorage.removeItem(storageKey);
		draft = createSurveyDraft();
		savedDraft = serializedDraft;
		saveFailed = false;
		step = 0;
	};

	let importInput = $state<HTMLInputElement>();

	const importFile = async (event: Event & { currentTarget: HTMLInputElement }) => {
		const input = event.currentTarget;
		const [file] = input.files ?? [];

		input.value = '';

		if (!file || !confirm(`Import ${file.name}? This replaces all current answers.`)) {
			return;
		}

		try {
			draft = { ...draft, ...parseSurveyCsv(await file.text(), data.questions) };
			step = 0;
		} catch (error) {
			alert(`Could not import ${file.name}: ${error instanceof Error ? error.message : error}`);
		}
	};

	const steps = $derived(
		dimensions.map(({ name, themes }, index) => {
			const indicators = themes.flatMap((theme) => theme.indicators);
			const questions = indicators.flatMap((indicator) => indicator.questions);

			return {
				index,
				name,
				unanswered: questions.filter((question) => !isAnswered(question, draft.choices)),
				incompleteReferences: indicators.filter((indicator) =>
					(draft.references[indicator.number] ?? []).some(
						(reference) => !isReferenceComplete(reference)
					)
				),
				total: questions.length
			};
		})
	);

	const incompleteSteps = $derived(
		steps.filter(
			({ unanswered, incompleteReferences }) =>
				unanswered.length > 0 || incompleteReferences.length > 0
		)
	);

	const generateStep = $derived(dimensions.length);
	const dimension = $derived(dimensions[step]);

	const questionLinks = $derived(
		(dimension?.themes ?? []).flatMap(({ indicators }) =>
			indicators.flatMap(({ name, questions }) =>
				questions.map((question) => ({
					id: questionElementId(question),
					label: `${question.number}. ${name}`,
					done: isAnswered(question, draft.choices)
				}))
			)
		)
	);

	const fileName = $derived(
		`${draft.country.trim().toLowerCase().replaceAll(/\s+/g, '-')}-${draft.chamber.toLowerCase()}-chamber.csv`
	);

	const goTo = (index: number) => {
		step = index;
		window.scrollTo({ top: 0, behavior: 'instant' });
	};

	const download = () => {
		const url = URL.createObjectURL(
			new Blob([formatSurveyCsv(data.questions, draft)], { type: 'text/csv' })
		);
		const link = document.createElement('a');

		link.href = url;
		link.download = fileName;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url));
	};
</script>

<Metadata page="Survey Generator" />

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<svelte:window onpagehide={save} />

<div class="sticky top-0 z-10 border-b border-gray-2 bg-white">
	<div class="content-container flex flex-col gap-3 py-3!">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h1 class="h5 font-bold">APOI Survey Generator</h1>
			<div class="flex items-center gap-4">
				<span class="b5 text-gray-8" aria-live="polite">{saveStatus}</span>
				<input
					type="file"
					accept=".csv,text/csv"
					class="hidden"
					bind:this={importInput}
					onchange={importFile}
				/>
				<Button variant="secondary" size="small" onclick={() => importInput?.click()}>
					Import CSV
				</Button>
				<Button variant="secondary" size="small" onclick={reset}>Reset</Button>
			</div>
		</div>

		<nav class="grid grid-cols-2 gap-1 md:grid-cols-4" aria-label="Survey steps">
			{#each [...steps, { name: 'Generate CSV', unanswered: [], total: 0 }] as { name, unanswered, total }, index (name)}
				<button
					type="button"
					aria-current={index === step ? 'step' : undefined}
					class={[
						'flex cursor-pointer flex-col items-start gap-0.5 border-t-4 px-2 py-1 text-left b5',
						index === step ? 'border-purple-5 font-bold' : 'border-gray-2 text-gray-8'
					]}
					onclick={() => goTo(index)}
				>
					<span>{name}</span>
					{#if index !== generateStep}
						<span class="flex items-center gap-1 font-normal">
							<SurveyStatusIcon done={unanswered.length === 0} />
							{total - unanswered.length}/{total} answered
						</span>
					{/if}
				</button>
			{/each}
		</nav>
	</div>
</div>

<div class="content-container flex flex-row gap-10">
	{#if questionLinks.length > 0}
		{#key step}
			<TocSidebar
				items={questionLinks}
				class="hidden max-h-[calc(100vh-10rem)] w-56 shrink-0 self-start overflow-y-auto lg:sticky lg:top-36 lg:flex"
			>
				{#snippet icon(id)}
					<SurveyStatusIcon done={questionLinks.some((link) => link.id === id && link.done)} />
				{/snippet}
			</TocSidebar>
		{/key}
	{/if}

	<div class="flex min-w-0 flex-1 flex-col gap-10">
		{#if dimension}
			<h2 class="h3 font-bold">{dimension.name}</h2>

			{#each dimension.themes as theme (theme.name)}
				<section class="flex flex-col gap-8">
					<h3 class="h4 font-bold text-purple-5">{theme.name}</h3>

					{#each theme.indicators as indicator (indicator.number)}
						<div class="flex flex-col gap-6">
							<h4 class="h5 font-bold">{indicator.number}. {indicator.name}</h4>

							{#each indicator.questions as question (question.number)}
								<SurveyQuestion {question} bind:choices={draft.choices} />
							{/each}

							<SurveyEvidence indicatorNumber={indicator.number} bind:draft />
						</div>
					{/each}
				</section>
			{/each}
		{:else}
			<h2 class="h3 font-bold">Generate CSV</h2>

			<div class="flex flex-col gap-4">
				<h3 class="b2 font-bold">Missing items</h3>

				{#each incompleteSteps as { index, name, unanswered, incompleteReferences } (name)}
					<div class="flex flex-col gap-1">
						<button
							type="button"
							class="cursor-pointer self-start b3 font-bold text-purple-5 underline"
							onclick={() => goTo(index)}
						>
							{name}
						</button>
						{#if unanswered.length > 0}
							<p>
								Unanswered questions: {unanswered.map((question) => question.number).join(', ')}
							</p>
						{/if}
						{#if incompleteReferences.length > 0}
							<p>
								Incomplete references in indicators: {incompleteReferences
									.map((indicator) => indicator.number)
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
					<input
						type="text"
						bind:value={draft.country}
						class="w-full border border-gray-4 bg-white px-3 py-2 md:w-96"
					/>
				</label>

				<fieldset class="flex flex-col gap-1">
					<legend class="b4 font-bold">Chamber</legend>
					<div class="flex gap-6">
						{#each chambers as chamber (chamber)}
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="chamber"
									value={chamber}
									bind:group={draft.chamber}
									class="accent-purple-5"
								/>
								{chamber} chamber
							</label>
						{/each}
					</div>
				</fieldset>

				<p class="b4 text-gray-8">File name: {draft.country.trim() ? fileName : '-'}</p>

				<Button class="self-start" disabled={!draft.country.trim()} onclick={download}>
					Download CSV
				</Button>
			</div>
		{/if}

		<div class="flex justify-between gap-4">
			<Button variant="secondary" disabled={step === 0} onclick={() => goTo(step - 1)}>
				Previous
			</Button>
			{#if step < generateStep}
				<Button onclick={() => goTo(step + 1)}>Next</Button>
			{/if}
		</div>
	</div>
</div>
