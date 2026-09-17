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
import { byChamber, type Chamber } from '$lib/constants/chambers';
import { dimensions } from '$lib/constants/dimensions';
import { answers, getAchievementLevel, type Answer } from '$lib/data/answers';
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

const sortByAchieved = (summaries: IndicatorSummary[]): IndicatorSummary[] =>
	summaries.toSorted(
		(a, b) =>
			b.achievedPercentage - a.achievedPercentage ||
			b.countryCountByLevel['Partly achieved'] - a.countryCountByLevel['Partly achieved'] ||
			b.countryCountByLevel['N/A'] - a.countryCountByLevel['N/A']
	);

const getIndicatorSummaries = (chamber: Chamber): IndicatorSummary[] =>
	sortByAchieved(
		indicators.map((indicator) => {
			const indicatorQuestions = questions.filter(
				({ indicatorNumber }) => indicatorNumber === indicator.number
			);
			const questionNumbers = new Set(indicatorQuestions.map(({ number }) => number));
			const indicatorAnswers = answers.filter(
				(answer) => questionNumbers.has(answer.questionNumber) && answer.chamber === chamber
			);

			const countryCountByLevel = countCountriesByLevel(indicatorAnswers);
			const applicableCount =
				countryCountByLevel['Achieved'] +
				countryCountByLevel['Partly achieved'] +
				countryCountByLevel['Not achieved'];

			return {
				indicator,
				questionCount: indicatorQuestions.length,
				countryCountByLevel,
				achievedPercentage: applicableCount
					? (countryCountByLevel['Achieved'] / applicableCount) * 100
					: 0
			};
		})
	);

export const indicatorSummariesByChamber = byChamber(getIndicatorSummaries);
