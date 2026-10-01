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

export const scopeAnswers = (answers: Answer[], scope: ChamberScope): Answer[] =>
	scope === 'Both' ? answers : answers.filter((answer) => answer.chamber === scope);

/** A scope only scores when every chamber it covers carries an applicable score */
const isScored = (answers: Answer[], scope: ChamberScope): boolean =>
	scope === 'Both'
		? chambers.every((chamber) => isScored(answers, chamber))
		: hasApplicableScore(scopeAnswers(answers, scope));

export const getChamberScore = (answers: Answer[], scope: ChamberScope): number | undefined =>
	isScored(answers, scope) ? getScorePercentage(scopeAnswers(answers, scope)) : undefined;

export const getChamberDimensionScores = (
	answers: Answer[],
	scope: ChamberScope,
	dimensionOf: (questionNumber: string) => Dimension | undefined = questionDimension
): ReturnType<typeof getDimensionScores> =>
	getDimensionScores(scopeAnswers(answers, scope), dimensionOf);

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
