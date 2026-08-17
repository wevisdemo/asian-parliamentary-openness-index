import { getGlossary } from '$lib/data/glossary';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => ({ glossary: await getGlossary() });
