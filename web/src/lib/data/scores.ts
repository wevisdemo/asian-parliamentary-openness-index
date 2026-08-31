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
	const percentages = dimensions
		.map((dimension) =>
			answers.filter(({ questionNumber }) => dimensionOf(questionNumber) === dimension)
		)
		.filter((dimensionAnswers) =>
			dimensionAnswers.some(({ totalApplicableScore }) => totalApplicableScore > 0)
		)
		.map(getScorePercentage);

	return percentages.length
		? percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length
		: 0;
};

/** Whether any answer carries an applicable score, i.e. the percentage is meaningful */
export const hasApplicableScore = (answers: Answer[]): boolean =>
	answers.some(({ totalApplicableScore }) => totalApplicableScore > 0);
