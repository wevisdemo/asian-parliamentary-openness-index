import { countries } from '$lib/data/countries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ countryCount: countries.length });
