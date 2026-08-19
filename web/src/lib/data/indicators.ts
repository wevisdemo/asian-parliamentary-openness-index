import indicatorsCsv from '$data/indicators.csv?raw';
import {
	asNumber,
	asOneOf,
	asString,
	Column,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { achievementLevels, type AchievementLevel } from '$lib/constants/achievements';
import { dimensions } from '$lib/constants/dimensions';
import { answers, getAchievementLevel, type Answer } from '$lib/data/answers';
import { countries } from '$lib/data/countries';
import { questions } from '$lib/data/questions';

export const indicatorSchema = Object({
	dimension: Column('Dimension', asOneOf(dimensions)),
	dimensionRelevance: Column('Dimension Relevance', asString()),
	number: Column('Indicator Number', asNumber()),
	name: Column('Indicator', asString())
});

export type Indicator = StaticDecode<typeof indicatorSchema>;

export const indicators: Indicator[] = parseCsv(indicatorsCsv, indicatorSchema);

export interface IndicatorSummary {
	indicator: Indicator;
	questionCount: number;
	countryCountByLevel: Record<AchievementLevel, number>;
	achievedPercentage: number;
}

const countCountriesByLevel = (indicatorAnswers: Answer[]): Record<AchievementLevel, number> => {
	const countryLevels = [...new Set(indicatorAnswers.map(({ country }) => country))].map(
		(country) =>
			getAchievementLevel(indicatorAnswers.filter(({ country: name }) => name === country))
	);

	return achievementLevels.reduce(
		(counts, level) => ({
			...counts,
			[level]: countryLevels.filter((countryLevel) => countryLevel === level).length
		}),
		{} as Record<AchievementLevel, number>
	);
};

export const indicatorSummaries: IndicatorSummary[] = indicators.map((indicator) => {
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

export const sortByAchieved = (summaries: IndicatorSummary[]): IndicatorSummary[] =>
	summaries.toSorted(
		(a, b) =>
			b.achievedPercentage - a.achievedPercentage ||
			b.countryCountByLevel['Partly achieved'] - a.countryCountByLevel['Partly achieved'] ||
			b.countryCountByLevel['N/A'] - a.countryCountByLevel['N/A']
	);
