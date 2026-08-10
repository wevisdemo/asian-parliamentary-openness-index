import questionsCsv from '$data/questions.csv?raw';
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
import { answerTypes } from '$lib/constants/answer-types';

const answerOptionPattern = /^([a-z])\)\s*(.*?)\s*\(([\d.]+)\)$/;

/** Decodes each line of `a) Completely accessible (1)` into `{ answer, text, score }` */
const asAnswerOptions = createTransformer({
	decode: (value: string) =>
		value
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
			.map((line) => {
				const match = answerOptionPattern.exec(line);

				if (!match) {
					throw new Error(`Option "${line}" is not in the "a) Text (1)" format`);
				}

				const [, answer, text, score] = match;

				return { answer, text, score: Number(score) };
			})
});

export const questionSchema = Object({
	indicatorNumber: Column('Indicator Number', asNumber()),
	number: Column('Question Number', asString()),
	question: Column('Question', asString()),
	answerType: Column('Answer Type', asOneOf(answerTypes)),
	answerOptions: Column('Answer Options', asAnswerOptions)
});

export type Question = StaticDecode<typeof questionSchema>;

export const questions: Question[] = parseCsv(questionsCsv, questionSchema);
