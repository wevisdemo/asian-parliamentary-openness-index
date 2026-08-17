import { createContext } from 'svelte';

class GlossaryState {
	isOpen = $state(false);
	selectedTerm = $state<string>();

	open(term?: string) {
		this.selectedTerm = term;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	showAllTerms() {
		this.selectedTerm = undefined;
	}
}

const [getGlossaryState, setGlossaryState] = createContext<GlossaryState>();

export const createGlossaryState = () => setGlossaryState(new GlossaryState());

export { getGlossaryState };
