import { describe, expect, it } from 'vitest';
import type { Dimension } from '$lib/constants/dimensions';
import type { Answer } from './answers';
import { getDimensionScores, getWeightedScorePercentage, hasApplicableScore } from './scores';

const dimensionOf = (questionNumber: string) => questionNumber.split('-')[0] as Dimension;

const asAnswers = (
	...scores: [questionNumber: string, score: number, totalApplicableScore: number][]
): Answer[] =>
	scores.map(([questionNumber, score, totalApplicableScore]) => ({
		country: 'Testland',
		chamber: 'Lower',
		questionNumber,
		answer: undefined,
		score,
		totalApplicableScore
	}));

describe('getWeightedScorePercentage', () => {
	it('returns zero when there is no answer', () => {
		expect(getWeightedScorePercentage([], dimensionOf)).toBe(0);
	});

	it('returns zero when no answer is applicable', () => {
		expect(
			getWeightedScorePercentage(asAnswers(['Openness on Information-1', 0, 0]), dimensionOf)
		).toBe(0);
	});

	it('gives every dimension an equal share regardless of its question count', () => {
		expect(
			getWeightedScorePercentage(
				asAnswers(
					['Openness on Information-1', 1, 1],
					['Openness on Information-2', 1, 1],
					['Openness on Information-3', 1, 1],
					['Openness on Accountability-1', 0, 1],
					['Openness on Citizen Participation-1', 0, 1]
				),
				dimensionOf
			)
		).toBeCloseTo(100 / 3);
	});

	it('averages the achieved share of each dimension', () => {
		expect(
			getWeightedScorePercentage(
				asAnswers(
					['Openness on Information-1', 1, 2],
					['Openness on Accountability-1', 1, 1],
					['Openness on Citizen Participation-1', 0, 1]
				),
				dimensionOf
			)
		).toBeCloseTo(50);
	});

	it('leaves out dimensions without an applicable score', () => {
		expect(
			getWeightedScorePercentage(
				asAnswers(['Openness on Information-1', 1, 2], ['Openness on Accountability-1', 0, 0]),
				dimensionOf
			)
		).toBe(50);
	});
});

describe('getDimensionScores', () => {
	it('returns the score percentage of every dimension in order', () => {
		expect(
			getDimensionScores(
				asAnswers(
					['Openness on Information-1', 1, 2],
					['Openness on Accountability-1', 1, 1],
					['Openness on Citizen Participation-1', 0, 1]
				),
				dimensionOf
			)
		).toEqual([
			{ dimension: 'Openness on Information', score: 50 },
			{ dimension: 'Openness on Accountability', score: 100 },
			{ dimension: 'Openness on Citizen Participation', score: 0 }
		]);
	});

	it('leaves the score undefined for dimensions without an applicable score', () => {
		expect(
			getDimensionScores(
				asAnswers(['Openness on Information-1', 1, 1], ['Openness on Accountability-1', 0, 0]),
				dimensionOf
			)
		).toEqual([
			{ dimension: 'Openness on Information', score: 100 },
			{ dimension: 'Openness on Accountability', score: undefined },
			{ dimension: 'Openness on Citizen Participation', score: undefined }
		]);
	});
});

describe('hasApplicableScore', () => {
	it('is false without any applicable answer', () => {
		expect(hasApplicableScore([])).toBe(false);
		expect(hasApplicableScore(asAnswers(['Openness on Information-1', 0, 0]))).toBe(false);
	});

	it('is true when an answer carries an applicable score', () => {
		expect(hasApplicableScore(asAnswers(['Openness on Information-1', 0, 1]))).toBe(true);
	});
});
