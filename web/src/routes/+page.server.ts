import { dimensions, type Dimension } from '$lib/constants/dimensions';
import { answers, getScorePercentage, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicators } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import { respondents } from '$lib/data/respondents';
import type { PageServerLoad } from './$types';

const getCountryScores = (scopedAnswers: Answer[]) =>
	countries.map((country) => ({
		name: country.name,
		score: getScorePercentage(scopedAnswers.filter(({ country: name }) => name === country.name))
	}));

const getAverageScore = (scopedAnswers: Answer[]) => {
	const scores = getCountryScores(scopedAnswers);

	return scores.length ? scores.reduce((sum, { score }) => sum + score, 0) / scores.length : 0;
};

const lowerChamberAnswers = answers.filter(({ chamber }) => chamber === 'Lower');

const getDimensionAnswers = (dimension: Dimension) => {
	const indicatorNumbers = new Set(
		indicators.filter((indicator) => indicator.dimension === dimension).map(({ number }) => number)
	);
	const questionNumbers = new Set(
		questions
			.filter(({ indicatorNumber }) => indicatorNumbers.has(indicatorNumber))
			.map(({ number }) => number)
	);

	return lowerChamberAnswers.filter(({ questionNumber }) => questionNumbers.has(questionNumber));
};

export const load: PageServerLoad = () => ({
	countryCount: countries.length,
	indicatorCount: indicators.length,
	averageScore: getAverageScore(lowerChamberAnswers),
	countryScores: getCountryScores(lowerChamberAnswers).toSorted((a, b) => b.score - a.score),
	dimensionScores: dimensions.map((dimension) => ({
		dimension,
		score: getAverageScore(getDimensionAnswers(dimension))
	})),
	teamLogos: [
		...new Map(
			respondents.flatMap(({ organization, organizationLogo }) =>
				organization && organizationLogo ? [[organization, organizationLogo] as const] : []
			)
		)
	].map(([organization, logo]) => ({ organization, logo }))
});
