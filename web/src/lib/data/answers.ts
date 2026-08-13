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

const optionStates: Record<string, boolean | undefined> = {
	yes: true,
	no: false,
	'n/a': undefined
};

/** Decodes `a=yes;b=no` into `{ a: true, b: false }`, `a` into `{ a: true }`, with all n/a omitted */
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

				if (!(state in optionStates)) {
					throw new Error(`Option "${option}" has an unknown value "${state}"`);
				}

				return [key, optionStates[state]] as const;
			})
			.reduce<Record<string, boolean>>(
				(options, [key, state]) => (state === undefined ? options : { ...options, [key]: state }),
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

export const getScorePercentage = (answers: Answer[]): number => {
	const total = answers.reduce((sum, { totalApplicableScore }) => sum + totalApplicableScore, 0);

	return total ? (answers.reduce((sum, { score }) => sum + score, 0) / total) * 100 : 0;
};

export const getAchievementLevel = (answers: Answer[]): AchievementLevel => {
	const applicable = answers.filter(({ totalApplicableScore }) => totalApplicableScore > 0);

	if (!applicable.length) return 'N/A';

	const achieved = applicable.filter(
		({ score, totalApplicableScore }) => score === totalApplicableScore
	);

	if (!achieved.length) return 'Not achieved';

	return achieved.length === applicable.length ? 'Achieved' : 'Partly achieved';
};
