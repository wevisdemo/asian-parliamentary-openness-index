import { describe, expect, it } from 'vitest';
import { parseCsv } from 'sheethuahua';
import { answerSchema, getAchievementLevel, getScorePercentage, type Answer } from './answers';

const asAnswers = (...scores: [score: number, totalApplicableScore: number][]): Answer[] =>
	scores.map(([score, totalApplicableScore], index) => ({
		country: 'Testland',
		chamber: 'Lower',
		questionNumber: `${index + 1}`,
		answer: undefined,
		score,
		totalApplicableScore
	}));

const parseAnswerColumn = (value: string) =>
	parseCsv(
		[
			'Country,Chamber,Question Number,Answer,Score,Total Applicable Score',
			`Testland,Lower,1,"${value}",1,1`
		].join('\n'),
		answerSchema
	)[0].answer;

describe('answer column', () => {
	it('decodes each selected option', () => {
		expect(parseAnswerColumn('a=yes;b=no')).toEqual({ a: true, b: false });
	});

	it('treats an option without a value as selected', () => {
		expect(parseAnswerColumn('a;b=no')).toEqual({ a: true, b: false });
	});

	it('omits options that are not applicable', () => {
		expect(parseAnswerColumn('a=yes;b=n/a')).toEqual({ a: true });
	});

	it('trims spaces around keys and values', () => {
		expect(parseAnswerColumn('a = yes ; b = no')).toEqual({ a: true, b: false });
	});

	it('has no answer when the whole column is empty or not applicable', () => {
		expect(parseAnswerColumn('')).toBeUndefined();
		expect(parseAnswerColumn('n/a')).toBeUndefined();
	});

	it('rejects an option with more than one equal sign', () => {
		expect(() => parseAnswerColumn('a=yes=no')).toThrow();
	});

	it('rejects an option with an empty key', () => {
		expect(() => parseAnswerColumn('=yes')).toThrow();
	});

	it('rejects an option with an unknown value', () => {
		expect(() => parseAnswerColumn('a=maybe')).toThrow();
	});
});

describe('getScorePercentage', () => {
	it('returns zero when there is no answer', () => {
		expect(getScorePercentage([])).toBe(0);
	});

	it('returns zero when no answer is applicable', () => {
		expect(getScorePercentage(asAnswers([0, 0], [0, 0]))).toBe(0);
	});

	it('returns the achieved share of the total applicable score', () => {
		expect(getScorePercentage(asAnswers([1, 2], [2, 2]))).toBe(75);
	});

	it('excludes non applicable answers from the total', () => {
		expect(getScorePercentage(asAnswers([1, 2], [0, 0]))).toBe(50);
	});
});

describe('getAchievementLevel', () => {
	it('is not applicable when there is no answer', () => {
		expect(getAchievementLevel([])).toBe('N/A');
	});

	it('is not applicable when every answer is not applicable', () => {
		expect(getAchievementLevel(asAnswers([0, 0], [0, 0]))).toBe('N/A');
	});

	it('is achieved when every applicable answer gets the full score', () => {
		expect(getAchievementLevel(asAnswers([2, 2], [1, 1]))).toBe('Achieved');
	});

	it('is achieved when the only answers below full score are not applicable', () => {
		expect(getAchievementLevel(asAnswers([2, 2], [0, 0]))).toBe('Achieved');
	});

	it('is partly achieved when some applicable answers miss the full score', () => {
		expect(getAchievementLevel(asAnswers([2, 2], [1, 2]))).toBe('Partly achieved');
	});

	it('is not achieved when no applicable answer gets the full score', () => {
		expect(getAchievementLevel(asAnswers([0, 2], [1, 2]))).toBe('Not achieved');
	});
});
