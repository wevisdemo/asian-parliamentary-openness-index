import { answers, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import type { Chamber } from '$lib/constants/chambers';
import type { PageServerLoad } from './$types';

const scoreRatio = (countryAnswers: Answer[]) => {
	const totalApplicableScore = countryAnswers.reduce(
		(sum, answer) => sum + answer.totalApplicableScore,
		0
	);

	if (!totalApplicableScore) return undefined;

	return countryAnswers.reduce((sum, answer) => sum + answer.score, 0) / totalApplicableScore;
};

const chamberScoreRatio = (countryAnswers: Answer[], chamber: Chamber) =>
	scoreRatio(countryAnswers.filter((answer) => answer.chamber === chamber));

const scores = countries
	.map((country) => {
		const countryAnswers = answers.filter(({ country: name }) => name === country.name);

		return {
			slug: country.slug,
			name: country.name,
			lowerChamberScore: chamberScoreRatio(countryAnswers, 'Lower'),
			upperChamberScore: chamberScoreRatio(countryAnswers, 'Upper')
		};
	})
	.sort((a, b) => (b.lowerChamberScore ?? -1) - (a.lowerChamberScore ?? -1));

const rankedCountries = scores.map((country, index) => ({
	...country,
	rank:
		scores.findIndex(({ lowerChamberScore }) => lowerChamberScore === country.lowerChamberScore) +
			1 || index + 1
}));

export const load: PageServerLoad = () => ({ countries: rankedCountries });
