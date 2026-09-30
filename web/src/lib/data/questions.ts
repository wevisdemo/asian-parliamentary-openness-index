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
import { parseAnswerOption, splitNonEmptyLines } from '$lib/data/transformers';

const asAnswerOptions = createTransformer({
	decode: (value: string) => splitNonEmptyLines(value).map(parseAnswerOption)
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
