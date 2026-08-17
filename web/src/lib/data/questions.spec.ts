import { describe, expect, it } from 'vitest';
import { parseCsv } from 'sheethuahua';
import { questionSchema } from './questions';

const parseAnswerOptionsColumn = (value: string) =>
	parseCsv(
		[
			'Indicator Number,Question Number,Question,Answer Type,Answer Options',
			`1,1.1,Is it accessible?,single,"${value}"`
		].join('\n'),
		questionSchema
	)[0].answerOptions;

describe('answer options column', () => {
	it('decodes the letter, text and score of an option', () => {
		expect(parseAnswerOptionsColumn('a) Completely accessible (1)')).toEqual([
			{ answer: 'a', text: 'Completely accessible', score: 1 }
		]);
	});

	it('decodes one option per line', () => {
		expect(parseAnswerOptionsColumn('a) Yes (1)\nb) No (0)')).toEqual([
			{ answer: 'a', text: 'Yes', score: 1 },
			{ answer: 'b', text: 'No', score: 0 }
		]);
	});

	it('ignores blank lines and surrounding spaces', () => {
		expect(parseAnswerOptionsColumn('\n  a) Yes (1)  \n\n  b) No (0)\n')).toEqual([
			{ answer: 'a', text: 'Yes', score: 1 },
			{ answer: 'b', text: 'No', score: 0 }
		]);
	});

	it('decodes a fractional score', () => {
		expect(parseAnswerOptionsColumn('a) Partly accessible (0.5)')).toEqual([
			{ answer: 'a', text: 'Partly accessible', score: 0.5 }
		]);
	});

	it('keeps parentheses that are part of the text', () => {
		expect(parseAnswerOptionsColumn('a) Yes (in practice) (1)')).toEqual([
			{ answer: 'a', text: 'Yes (in practice)', score: 1 }
		]);
	});

	it('rejects a question without any option', () => {
		expect(() => parseAnswerOptionsColumn('')).toThrow();
	});

	it('rejects an option without a score', () => {
		expect(() => parseAnswerOptionsColumn('a) Yes')).toThrow();
	});

	it('rejects an option without a letter', () => {
		expect(() => parseAnswerOptionsColumn('Yes (1)')).toThrow();
	});
});
