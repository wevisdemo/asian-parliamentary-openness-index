import { achievementLevels, type AchievementLevel } from '$lib/constants/achievements';
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

export const load: PageServerLoad = () => {
	const indicatorSummaries = indicators.map((indicator) => {
		const indicatorQuestions = questions.filter(
			({ indicatorNumber }) => indicatorNumber === indicator.number
		);
		const questionNumbers = new Set(indicatorQuestions.map(({ number }) => number));
		const indicatorAnswers = answers.filter(({ questionNumber }) =>
			questionNumbers.has(questionNumber)
		);

		return {
			indicator,
			questionCount: indicatorQuestions.length,
			countryCountByLevel: countCountriesByLevel(indicatorAnswers),
			achievedPercentage: getScorePercentage(indicatorAnswers)
		};
	});

	const dimensionInsights = dimensions.map((dimension) => {
		const ranked = indicatorSummaries
			.filter(({ indicator }) => indicator.dimension === dimension)
			.sort((a, b) => b.achievedPercentage - a.achievedPercentage);

		return {
			dimension,
			points: ranked.reduce((sum, { questionCount }) => sum + questionCount, 0),
			mostAchieved: ranked.slice(0, TOP_COUNT),
			leastAchieved: ranked.slice(Math.max(TOP_COUNT, ranked.length - TOP_COUNT)).reverse()
		};
	});

	return {
		countryCount: countries.length,
		totalPoints: questions.length,
		dimensionInsights
	};
};
