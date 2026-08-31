import { answers, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { getWeightedScorePercentage, hasApplicableScore } from '$lib/data/scores';
import type { Chamber } from '$lib/constants/chambers';
import type { PageServerLoad } from './$types';

const chamberScore = (countryAnswers: Answer[], chamber: Chamber) => {
	const chamberAnswers = countryAnswers.filter((answer) => answer.chamber === chamber);

	return hasApplicableScore(chamberAnswers)
		? getWeightedScorePercentage(chamberAnswers)
		: undefined;
};

const scores = countries
	.map((country) => {
		const countryAnswers = answers.filter(({ country: name }) => name === country.name);

		return {
			slug: country.slug,
			name: country.name,
			lowerChamberScore: chamberScore(countryAnswers, 'Lower'),
			upperChamberScore: chamberScore(countryAnswers, 'Upper')
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
