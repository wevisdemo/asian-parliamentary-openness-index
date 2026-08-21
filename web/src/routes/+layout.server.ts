import { getGlossary } from '$lib/data/glossary';
import { getCycles } from '$lib/data/cycle';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const [glossary, cycles] = await Promise.all([getGlossary(), getCycles()]);
	const [cycle] = cycles;

	if (!cycle) {
		throw new Error('No assessment cycle found in the cycle context sheet');
	}

	return { glossary, cycle };
};
