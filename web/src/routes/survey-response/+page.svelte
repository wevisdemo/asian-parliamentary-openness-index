<script lang="ts">
	import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte';
	import apoiLongLogo from '$lib/assets/images/apoi-long.png';
	import Button from '$lib/components/button.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import TocSidebar from '$lib/components/toc-sidebar.svelte';
	import { SurveyDraftState } from '$lib/components/survey-response/survey-draft-state.svelte';
	import SurveyEvidence from '$lib/components/survey-response/survey-evidence.svelte';
	import SurveyGenerate from '$lib/components/survey-response/survey-generate.svelte';
	import SurveyQuestion from '$lib/components/survey-response/survey-question.svelte';
	import SurveyStatusIcon from '$lib/components/survey-response/survey-status-icon.svelte';
	import { surveyChamberOptions } from '$lib/constants/chambers';
	import { inputClass } from '$lib/constants/control-styles';
	import {
		applyUnscoredDependencies,
		createSurveyAnswers,
		findDependency,
		groupSurveyQuestions,
		isAnswered,
		isReferenceComplete,
		parseSurveyCsv,
		questionElementId
	} from '$lib/data/survey';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const survey = new SurveyDraftState();

	const dimensions = $derived(groupSurveyQuestions(data.questions));

	const dependencies = $derived(
		new Map(
			data.questions.map((question) => [question.number, findDependency(question, data.questions)])
		)
	);

	const chamberLabel = $derived(
		surveyChamberOptions.find(({ value }) => value === survey.draft.chamber)?.label
	);

	let step = $state(0);
	let country = $state('');

	const goTo = (index: number) => {
		step = index;
		window.scrollTo({ top: 0, behavior: 'instant' });
	};

	const start = (event: SubmitEvent) => {
		event.preventDefault();
		survey.draft.country = country.trim();
		goTo(0);
	};

	const clearChamber = () => {
		if (!confirm(`Clear all answers of the ${chamberLabel}? This cannot be undone.`)) {
			return;
		}

		survey.answers = createSurveyAnswers();
		step = 0;
	};

	const clearCountry = () => {
		if (
			!confirm(
				`Clear ${survey.draft.country} and the answers of both chambers? This cannot be undone.`
			)
		) {
			return;
		}

		survey.clear();
		country = '';
	};

	let importInput = $state<HTMLInputElement>();

	const importFile = async (event: Event & { currentTarget: HTMLInputElement }) => {
		const input = event.currentTarget;
		const [file] = input.files ?? [];

		input.value = '';

		if (
			!file ||
			!confirm(`Import ${file.name} as the ${chamberLabel}? This replaces all its current answers.`)
		) {
			return;
		}

		try {
			survey.answers = parseSurveyCsv(await file.text(), data.questions);
			step = 0;
		} catch (error) {
			alert(`Could not import ${file.name}: ${error instanceof Error ? error.message : error}`);
		}
	};

	const choices = $derived(applyUnscoredDependencies(data.questions, survey.answers.choices));

	const steps = $derived(
		dimensions.map(({ name, indicators }, index) => {
			const questions = indicators.flatMap((indicator) => indicator.questions);

			return {
				index,
				name,
				unanswered: questions.filter((question) => !isAnswered(question, choices)),
				incompleteReferences: questions.filter((question) =>
					(survey.answers.references[question.number] ?? []).some(
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
		(dimension?.indicators ?? []).flatMap(({ name, questions }) =>
			questions.map((question) => ({
				id: questionElementId(question),
				label: `${question.number}. ${name}`,
				done: isAnswered(question, choices)
			}))
		)
	);
</script>

<Metadata page="Survey Response" />

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<svelte:window onpagehide={survey.save} />

{#snippet stepTab(index: number, name: string, unanswered?: number, total = 0)}
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
		{#if unanswered !== undefined}
			<span class="flex items-center gap-1 font-normal">
				<SurveyStatusIcon done={unanswered === 0} />
				{total - unanswered}/{total} answered
			</span>
		{/if}
	</button>
{/snippet}

{#if !survey.isLoaded}
	<p class="content-container text-center b4 text-gray-8">{survey.status}</p>
{:else if !survey.draft.country}
	<div class="content-container flex flex-1 flex-col items-center justify-center">
		<form
			class="flex w-full max-w-md flex-col items-center gap-6 bg-gray-1 p-8 text-center"
			onsubmit={start}
		>
			<img src={apoiLongLogo} alt="Asian Parliamentary Openness Index" class="h-16 w-auto" />

			<label class="flex w-full flex-col gap-1">
				<span class="b2 font-bold">Survey Response Country</span>
				<input
					type="text"
					bind:value={country}
					class={[inputClass, 'text-center']}
					placeholder="Country name"
				/>
			</label>

			<Button type="submit" disabled={!country.trim()}>Start</Button>
		</form>
	</div>
{:else}
	<div class="sticky top-0 z-10 border-b border-gray-2 bg-white">
		<div class="content-container flex flex-col gap-3 py-3!">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
					<h1 class="h5 font-bold">{survey.draft.country}</h1>
					<Dropdown
						options={surveyChamberOptions}
						value={survey.draft.chamber}
						variant="compact"
						onselect={(chamber) => (survey.draft.chamber = chamber)}
					/>
				</div>
				<div class="flex items-center gap-4">
					<span class="b5 text-gray-8" aria-live="polite">{survey.status}</span>
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
					<Button variant="secondary" size="small" onclick={clearChamber}>Clear chamber</Button>
					<Button variant="secondary" size="small" onclick={clearCountry}>Clear country</Button>
				</div>
			</div>

			<nav class="grid grid-cols-2 gap-1 md:grid-cols-4" aria-label="Survey steps">
				{#each steps as { index, name, unanswered, total } (name)}
					{@render stepTab(index, name, unanswered.length, total)}
				{/each}
				{@render stepTab(generateStep, 'Generate CSV')}
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
					{#snippet icon({ done })}
						<SurveyStatusIcon {done} />
					{/snippet}
				</TocSidebar>
			{/key}
		{/if}

		<div class="flex min-w-0 flex-1 flex-col gap-10">
			{#if dimension}
				<div class="flex items-start gap-2 bg-data-partly-achieved p-4 b5" role="note">
					<WarningAltFilled size={16} class="shrink-0" aria-hidden="true" />
					<p>
						Answers are saved automatically in this browser, but the browser may clear them without
						warning if you don't return for a few days. We recommend downloading the CSV from the
						<Hyperlink onclick={() => goTo(generateStep)}>Generate CSV</Hyperlink> step as a backup. You
						can import it later to continue in any browser.
					</p>
				</div>

				<h2 class="h3 font-bold">{dimension.name}</h2>

				{#each dimension.indicators as indicator (indicator.number)}
					<section class="flex flex-col gap-6">
						<h3 class="h5 font-bold">{indicator.number}. {indicator.name}</h3>

						{#each indicator.questions as question (question.number)}
							<SurveyQuestion
								{question}
								dependency={dependencies.get(question.number)}
								bind:choices={survey.answers.choices}
							>
								<SurveyEvidence questionNumber={question.number} bind:answers={survey.answers} />
							</SurveyQuestion>
						{/each}
					</section>
				{/each}
			{:else}
				<SurveyGenerate
					questions={data.questions}
					draft={survey.draft}
					{chamberLabel}
					{incompleteSteps}
					onstep={goTo}
				/>
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
{/if}
