import { countries } from '$lib/data/countries';
import { getCycles } from '$lib/data/cycle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	countryCount: countries.length,
	cycles: await getCycles()
});
