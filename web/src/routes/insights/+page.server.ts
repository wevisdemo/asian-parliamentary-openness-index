import { byChamberScope } from '$lib/constants/chambers';
import { dimensions } from '$lib/constants/dimensions';
import { answers, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicators, indicatorSummariesByChamber } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import { getChamberScore } from '$lib/data/scores';
import type { PageServerLoad } from './$types';

const TOP_COUNT = 3;

const getCountryScores = (scopedAnswers: Answer[]) =>
	countries.map((country) => {
		const countryAnswers = scopedAnswers.filter(({ country: name }) => name === country.name);

		return {
			country,
			chamberScores: byChamberScope((scope) => getChamberScore(countryAnswers, scope))
		};
	});

export const load: PageServerLoad = () => {
	const dimensionInsights = dimensions.map((dimension) => {
		const dimensionIndicators = indicators.filter((indicator) => indicator.dimension === dimension);

		const questionNumbers = new Set(
			questions
				.filter(({ indicatorNumber }) =>
					dimensionIndicators.some(({ number }) => number === indicatorNumber)
				)
				.map(({ number }) => number)
		);

		const topIndicators = byChamberScope((scope) => {
			const ranked = indicatorSummariesByChamber[scope].filter(
				({ indicator }) => indicator.dimension === dimension
			);

			return {
				mostAchieved: ranked.slice(0, TOP_COUNT),
				leastAchieved: ranked.slice(Math.max(TOP_COUNT, ranked.length - TOP_COUNT)).reverse()
			};
		});

		return {
			dimension,
			indicatorCount: dimensionIndicators.length,
			topIndicators,
			countryScores: getCountryScores(
				answers.filter(({ questionNumber }) => questionNumbers.has(questionNumber))
			)
		};
	});

	return {
		countryCount: countries.length,
		countryScores: getCountryScores(answers),
		dimensionInsights
	};
};
