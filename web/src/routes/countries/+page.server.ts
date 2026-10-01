import { answers } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { getChamberScore } from '$lib/data/scores';
import type { PageServerLoad } from './$types';

const scores = countries
	.map((country) => {
		const countryAnswers = answers.filter(({ country: name }) => name === country.name);

		return {
			slug: country.slug,
			name: country.name,
			lowerChamberScore: getChamberScore(countryAnswers, 'Lower'),
			upperChamberScore: getChamberScore(countryAnswers, 'Upper'),
			aggregatedScore: getChamberScore(countryAnswers, 'Both')
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
