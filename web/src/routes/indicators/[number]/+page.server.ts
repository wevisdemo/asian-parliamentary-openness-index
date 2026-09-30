import { error } from '@sveltejs/kit';
import { chambers, type Chamber } from '$lib/constants/chambers';
import { answers, getAchievementLevel, getScorePercentage } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicators, indicatorSummariesByChamber } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	indicators.map(({ number }) => ({ number: `${number}` }));

const indicatorOptions = indicators
	.map(({ number, name }) => ({ label: name, value: `${number}` }))
	.sort((a, b) => a.label.localeCompare(b.label));

export const load: PageServerLoad = ({ params }) => {
	const indicator = indicators.find(({ number }) => `${number}` === params.number);

	if (!indicator) error(404, `Indicator "${params.number}" not found`);

	const indicatorQuestions = questions.filter(
		({ indicatorNumber }) => indicatorNumber === indicator.number
	);
	const questionNumbers = new Set(indicatorQuestions.map(({ number }) => number));

	const getCountryResults = (chamber: Chamber) =>
		countries
			.map((country) => ({
				country,
				answers: answers.filter(
					(answer) =>
						answer.country === country.name &&
						answer.chamber === chamber &&
						questionNumbers.has(answer.questionNumber)
				)
			}))
			.filter((result) => result.answers.length)
			.map((result) => ({
				...result,
				score: getScorePercentage(result.answers),
				level: getAchievementLevel(result.answers)
			}))
			.sort((a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name));

	const chamberResults = chambers
		.map((chamber) => ({
			chamber,
			summary: indicatorSummariesByChamber[chamber].find(
				(summary) => summary.indicator.number === indicator.number
			)!,
			countryResults: getCountryResults(chamber)
		}))
		.filter(({ countryResults }) => countryResults.length);

	return {
		indicator,
		indicatorOptions,
		questions: indicatorQuestions,
		chamberResults
	};
};
