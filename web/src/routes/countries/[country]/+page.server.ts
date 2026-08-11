import { error } from '@sveltejs/kit';
import { answers } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicatorContexts } from '$lib/data/indicator-contexts';
import { indicators } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import { respondents } from '$lib/data/respondents';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => countries.map(({ slug }) => ({ country: slug }));

const countryOptions = countries.map(({ name, slug }) => ({ label: name, value: slug }));

const indicatorQuestions = indicators.map((indicator) => ({
	indicator,
	questions: questions.filter(({ indicatorNumber }) => indicatorNumber === indicator.number)
}));

export const load: PageServerLoad = ({ params }) => {
	const country = countries.find((c) => c.slug === params.country);

	if (!country) error(404, `Country "${params.country}" not found`);

	return {
		country,
		countryOptions,
		respondents: respondents.filter(({ country: name }) => name === country.name),
		indicatorQuestions,
		answers: answers.filter(({ country: name }) => name === country.name),
		indicatorContexts: indicatorContexts.filter(({ country: name }) => name === country.name)
	};
};
