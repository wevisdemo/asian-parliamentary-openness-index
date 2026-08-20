import { error } from '@sveltejs/kit';
import { indicators, indicatorSummaries } from '$lib/data/indicators';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	indicators.map(({ number }) => ({ number: `${number}` }));

const indicatorOptions = indicators.map(({ number, name }) => ({
	label: name,
	value: `${number}`
}));

export const load: PageServerLoad = ({ params }) => {
	const summary = indicatorSummaries.find(
		({ indicator }) => `${indicator.number}` === params.number
	);

	if (!summary) error(404, `Indicator "${params.number}" not found`);

	return { summary, indicatorOptions };
};
