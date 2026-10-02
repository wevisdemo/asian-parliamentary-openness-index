import { onMount } from 'svelte';
import {
	createSurveyDraft,
	restoreSurveyDraft,
	type SurveyAnswers,
	type SurveyDraft
} from '$lib/data/survey';

const storageKey = 'apoi-survey-response-draft';
const saveDelay = 1000;

/**
 * Must be created during component initialisation
 */
export class SurveyDraftState {
	draft = $state<SurveyDraft>(createSurveyDraft());

	get answers() {
		return this.draft.answers[this.draft.chamber];
	}

	set answers(answers: SurveyAnswers) {
		this.draft.answers[this.draft.chamber] = answers;
	}

	#saved = $state<string>();
	#saveFailed = $state(false);
	#serialized = $derived(JSON.stringify(this.draft));

	isLoaded = $derived(this.#saved !== undefined);

	status = $derived.by(() => {
		if (!this.isLoaded) {
			return 'Loading saved answers…';
		}

		if (this.#saveFailed) {
			return 'Could not save, the browser storage may be full';
		}

		return this.#serialized === this.#saved ? 'All changes saved' : 'Saving…';
	});

	constructor() {
		onMount(() => {
			const stored = localStorage.getItem(storageKey);

			try {
				if (stored) {
					this.draft = restoreSurveyDraft(JSON.parse(stored));
				}
			} catch {
				alert('Could not read the saved answers, starting with an empty survey.');
			}

			this.#saved = this.#serialized;

			return this.save;
		});

		$effect(() => {
			if (this.#serialized === this.#saved) {
				return;
			}

			const timeout = setTimeout(this.save, saveDelay);

			return () => clearTimeout(timeout);
		});
	}

	save = () => {
		if (this.#saved === undefined || this.#serialized === this.#saved) {
			return;
		}

		try {
			localStorage.setItem(storageKey, this.#serialized);
			this.#saved = this.#serialized;
			this.#saveFailed = false;
		} catch {
			this.#saveFailed = true;
		}
	};

	clear = () => {
		localStorage.removeItem(storageKey);
		this.draft = createSurveyDraft();
		this.#saved = this.#serialized;
		this.#saveFailed = false;
	};
}
