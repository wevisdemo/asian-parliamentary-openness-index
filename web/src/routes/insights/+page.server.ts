import { achievementLevels, type AchievementLevel } from '$lib/constants/achievements';
import { chambers, type Chamber } from '$lib/constants/chambers';
import { dimensions } from '$lib/constants/dimensions';
import { answers, getAchievementLevel, getScorePercentage, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { indicators } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';
import type { PageServerLoad } from './$types';

const TOP_COUNT = 3;

const countCountriesByLevel = (indicatorAnswers: Answer[]): Record<AchievementLevel, number> => {
	const countryLevels = [...new Set(indicatorAnswers.map(({ country }) => country))].map(
		(country) =>
			getAchievementLevel(indicatorAnswers.filter(({ country: name }) => name === country))
	);

	return Object.fromEntries(
		achievementLevels.map((level) => [
			level,
			countryLevels.filter((countryLevel) => countryLevel === level).length
		])
	) as Record<AchievementLevel, number>;
};

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
	const indicatorSummaries = indicators.map((indicator) => {
		const indicatorQuestions = questions.filter(
			({ indicatorNumber }) => indicatorNumber === indicator.number
		);
		const questionNumbers = new Set(indicatorQuestions.map(({ number }) => number));
		const indicatorAnswers = answers.filter(({ questionNumber }) =>
			questionNumbers.has(questionNumber)
		);

		const countryCountByLevel = countCountriesByLevel(indicatorAnswers);
		const applicableCount = countries.length - countryCountByLevel['N/A'];

		return {
			indicator,
			questionCount: indicatorQuestions.length,
			countryCountByLevel,
			achievedPercentage: applicableCount
				? (countryCountByLevel['Achieved'] / applicableCount) * 100
				: 0
		};
	});

	const dimensionInsights = dimensions.map((dimension) => {
		const ranked = indicatorSummaries
			.filter(({ indicator }) => indicator.dimension === dimension)
			.sort(
				(a, b) =>
					b.achievedPercentage - a.achievedPercentage ||
					b.countryCountByLevel['Partly achieved'] - a.countryCountByLevel['Partly achieved'] ||
					b.countryCountByLevel['N/A'] - a.countryCountByLevel['N/A']
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
