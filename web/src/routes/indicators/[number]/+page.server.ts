import { error } from '@sveltejs/kit';
import { answers, getScorePercentage } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicatorContexts } from '$lib/data/indicator-contexts';
import { indicators, indicatorSummaries } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	indicators.map(({ number }) => ({ number: `${number}` }));

const indicatorOptions = indicators
	.map(({ number, name }) => ({ label: name, value: `${number}` }))
	.sort((a, b) => a.label.localeCompare(b.label));

export const load: PageServerLoad = ({ params }) => {
	const summary = indicatorSummaries.find(
		({ indicator }) => `${indicator.number}` === params.number
	);

	if (!summary) error(404, `Indicator "${params.number}" not found`);

	const indicatorQuestions = questions.filter(
		({ indicatorNumber }) => indicatorNumber === summary.indicator.number
	);
	const questionNumbers = new Set(indicatorQuestions.map(({ number }) => number));

	const countryResults = countries
		.map((country) => ({
			country,
			answers: answers.filter(
				({ country: name, questionNumber }) =>
					name === country.name && questionNumbers.has(questionNumber)
			),
			contexts: indicatorContexts.filter(
				({ country: name, indicatorNumber }) =>
					name === country.name && indicatorNumber === summary.indicator.number
			)
		}))
		.map((result) => ({ ...result, score: getScorePercentage(result.answers) }))
		.sort((a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name));

	return { summary, indicatorOptions, questions: indicatorQuestions, countryResults };
};
