import { countries } from '$lib/data/countries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	countries: countries
		.map(({ slug, name }) => ({ slug, name }))
		.toSorted((a, b) => a.name.localeCompare(b.name))
});
