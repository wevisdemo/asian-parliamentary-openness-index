import answersCsv from '$data/answers.csv?raw';
import {
	asNumber,
	asOneOf,
	asString,
	Column,
	createTransformer,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import type { AchievementLevel } from '$lib/constants/achievements';
import { chambers } from '$lib/constants/chambers';
import { isOptionState, type OptionState } from '$lib/constants/option-states';

/** Decodes `a=yes;b=n/a` into `{ a: 'yes', b: 'n/a' }`, `a` into `{ a: 'yes' }` */
const asAnswer = createTransformer({
	decode: (value: string) =>
		value
			.split(';')
			.map((option) => {
				const parts = option.split('=').map((part) => part.trim());

				if (parts.length > 2) {
					throw new Error(`Option "${option}" has more than one "="`);
				}

				const [key, state = 'yes'] = parts;

				if (!key) {
					throw new Error(`Option "${option}" has an empty key`);
				}

				if (!isOptionState(state)) {
					throw new Error(`Option "${option}" has an unknown value "${state}"`);
				}

				return [key, state] as const;
			})
			.reduce<Record<string, OptionState>>(
				(options, [key, state]) => ({ ...options, [key]: state }),
				{}
			),
	emptyValues: ['', 'n/a']
});

export const answerSchema = Object({
	country: Column('Country', asString()),
	chamber: Column('Chamber', asOneOf(chambers)),
	questionNumber: Column('Question Number', asString()),
	answer: Column('Answer', asAnswer.optional()),
	score: Column('Score', asNumber()),
	totalApplicableScore: Column('Total Applicable Score', asNumber())
});

export type Answer = StaticDecode<typeof answerSchema>;

export const answers: Answer[] = parseCsv(answersCsv, answerSchema);

export const getScoreTotals = (answers: Answer[]) => ({
	score: answers.reduce((sum, { score }) => sum + score, 0),
	totalApplicableScore: answers.reduce(
		(sum, { totalApplicableScore }) => sum + totalApplicableScore,
		0
	)
});

export const getScorePercentage = (answers: Answer[]): number => {
	const { score, totalApplicableScore } = getScoreTotals(answers);

	return totalApplicableScore ? (score / totalApplicableScore) * 100 : 0;
};

export const getAchievementLevel = (answers: Answer[]): AchievementLevel => {
	const applicable = answers.filter(({ totalApplicableScore }) => totalApplicableScore > 0);

	if (!applicable.length) return 'N/A';

	const score = applicable.reduce((sum, { score }) => sum + score, 0);

	if (score === 0) return 'Not achieved';

	const total = applicable.reduce((sum, { totalApplicableScore }) => sum + totalApplicableScore, 0);

	return score === total ? 'Achieved' : 'Partly achieved';
};
