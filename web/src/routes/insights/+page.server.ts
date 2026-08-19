import { chambers, type Chamber } from '$lib/constants/chambers';
import { dimensions } from '$lib/constants/dimensions';
import { answers, getScorePercentage, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicatorSummaries, sortByAchieved } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import type { PageServerLoad } from './$types';

const TOP_COUNT = 3;

const getCountryScores = (scopedAnswers: Answer[]) =>
	countries.map((country) => {
		const countryAnswers = scopedAnswers.filter(({ country: name }) => name === country.name);

		const chamberScore = (chamber: Chamber) => {
			const chamberAnswers = countryAnswers.filter((answer) => answer.chamber === chamber);

			return chamberAnswers.length ? getScorePercentage(chamberAnswers) : undefined;
		};

		return {
			country,
			score: getScorePercentage(countryAnswers),
			chamberScores: Object.fromEntries(
				chambers.map((chamber) => [chamber, chamberScore(chamber)])
			) as Partial<Record<Chamber, number>>
		};
	});

export const load: PageServerLoad = () => {
	const dimensionInsights = dimensions.map((dimension) => {
		const ranked = sortByAchieved(
			indicatorSummaries.filter(({ indicator }) => indicator.dimension === dimension)
		);

		const questionNumbers = new Set(
			questions
				.filter(({ indicatorNumber }) =>
					ranked.some(({ indicator }) => indicator.number === indicatorNumber)
				)
				.map(({ number }) => number)
		);

		return {
			dimension,
			points: ranked.reduce((sum, { questionCount }) => sum + questionCount, 0),
			mostAchieved: ranked.slice(0, TOP_COUNT),
			leastAchieved: ranked.slice(Math.max(TOP_COUNT, ranked.length - TOP_COUNT)).reverse(),
			countryScores: getCountryScores(
				answers.filter(({ questionNumber }) => questionNumbers.has(questionNumber))
			)
		};
	});

	return {
		countryCount: countries.length,
		totalPoints: questions.length,
		countryScores: getCountryScores(answers),
		dimensionInsights
	};
};
