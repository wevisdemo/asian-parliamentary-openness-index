import { error } from '@sveltejs/kit';
import { countries } from '$lib/data/countries';

export const entries = () => countries.map(({ slug }) => ({ country: slug }));

export const load = ({ params }) => {
	const country = countries.find((c) => c.slug === params.country);

	if (!country) error(404, `Country "${params.country}" not found`);

	return { country, countries };
};
