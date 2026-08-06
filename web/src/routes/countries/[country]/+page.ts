import { error } from '@sveltejs/kit';
import { countries } from '$lib/data/countries';

export const entries = () => countries.map(({ value }) => ({ country: value }));

export const load = ({ params }) => {
	const country = countries.find((c) => c.value === params.country);

	if (!country) error(404, `Country "${params.country}" not found`);

	return { country, countries };
};
