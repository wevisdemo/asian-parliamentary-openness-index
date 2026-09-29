import { chambers, type ChamberScope } from '$lib/constants/chambers';
import { dimensions, type Dimension } from '$lib/constants/dimensions';
import { getScorePercentage, type Answer } from '$lib/data/answers';
import { indicators } from '$lib/data/indicators';
import { questions } from '$lib/data/questions';

const dimensionByIndicatorNumber = new Map(
	indicators.map(({ number, dimension }) => [number, dimension])
);

const dimensionByQuestionNumber = new Map(
	questions.map(({ number, indicatorNumber }) => [
		number,
		dimensionByIndicatorNumber.get(indicatorNumber)
	])
);

const questionDimension = (questionNumber: string) => dimensionByQuestionNumber.get(questionNumber);

/**
 * Share of the applicable score achieved, where every dimension contributes equally
 * no matter how many questions it holds. Dimensions without an applicable score are left out
 */
export const getWeightedScorePercentage = (
	answers: Answer[],
	dimensionOf: (questionNumber: string) => Dimension | undefined = questionDimension
): number => {
	const percentages = getDimensionScores(answers, dimensionOf)
		.map(({ score }) => score)
		.filter((score) => score !== undefined);

	return percentages.length
		? percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length
		: 0;
};

const averageOf = (scores: (number | undefined)[]): number | undefined =>
	scores.every((score): score is number => score !== undefined)
		? scores.reduce((sum, score) => sum + score, 0) / scores.length
		: undefined;

export const getChamberScore = (
	answers: Answer[],
	scope: ChamberScope,
	dimensionOf: (questionNumber: string) => Dimension | undefined = questionDimension
): number | undefined => {
	if (scope === 'Both') {
		return averageOf(chambers.map((chamber) => getChamberScore(answers, chamber, dimensionOf)));
	}

	const chamberAnswers = answers.filter((answer) => answer.chamber === scope);

	return hasApplicableScore(chamberAnswers)
		? getWeightedScorePercentage(chamberAnswers, dimensionOf)
		: undefined;
};

export const getChamberDimensionScores = (
	answers: Answer[],
	scope: ChamberScope,
	dimensionOf: (questionNumber: string) => Dimension | undefined = questionDimension
): ReturnType<typeof getDimensionScores> => {
	if (scope === 'Both') {
		const chamberDimensionScores = chambers.map((chamber) =>
			getChamberDimensionScores(answers, chamber, dimensionOf)
		);

		return dimensions.map((dimension, index) => ({
			dimension,
			score: averageOf(chamberDimensionScores.map((scores) => scores[index].score))
		}));
	}

	return getDimensionScores(
		answers.filter((answer) => answer.chamber === scope),
		dimensionOf
	);
};

export const getDimensionScores = (
	answers: Answer[],
	dimensionOf: (questionNumber: string) => Dimension | undefined = questionDimension
) =>
	dimensions.map((dimension) => {
		const dimensionAnswers = answers.filter(
			({ questionNumber }) => dimensionOf(questionNumber) === dimension
		);

		return {
			dimension,
			score: hasApplicableScore(dimensionAnswers) ? getScorePercentage(dimensionAnswers) : undefined
		};
	});

/** Whether any answer carries an applicable score, i.e. the percentage is meaningful */
export const hasApplicableScore = (answers: Answer[]): boolean =>
	answers.some(({ totalApplicableScore }) => totalApplicableScore > 0);
