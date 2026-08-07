import { error } from '@sveltejs/kit';
import { countries } from '$lib/data/countries';
import { respondents } from '$lib/data/respondents';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => countries.map(({ slug }) => ({ country: slug }));

export const load: PageLoad = ({ params }) => {
	const country = countries.find((c) => c.slug === params.country);

	if (!country) error(404, `Country "${params.country}" not found`);

	return {
		country,
		countries,
		respondents: respondents.filter(({ country: name }) => name === country.name)
	};
};
