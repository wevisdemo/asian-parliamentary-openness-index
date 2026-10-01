import { describe, expect, it } from 'vitest';
import type { Dimension } from '$lib/constants/dimensions';
import type { Answer } from './answers';
import { getChamberDimensionScores, getChamberScore, getDimensionScores } from './scores';

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
		totalApplicableScore,
		context: undefined,
		evidences: []
	}));

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
			{
				dimension: 'Openness on Information',
				totals: { score: 1, totalApplicableScore: 2 },
				score: 50
			},
			{
				dimension: 'Openness on Accountability',
				totals: { score: 1, totalApplicableScore: 1 },
				score: 100
			},
			{
				dimension: 'Openness on Citizen Participation',
				totals: { score: 0, totalApplicableScore: 1 },
				score: 0
			}
		]);
	});

	it('leaves the score undefined for dimensions without an applicable score', () => {
		expect(
			getDimensionScores(
				asAnswers(['Openness on Information-1', 1, 1], ['Openness on Accountability-1', 0, 0]),
				dimensionOf
			)
		).toEqual([
			{
				dimension: 'Openness on Information',
				totals: { score: 1, totalApplicableScore: 1 },
				score: 100
			},
			{
				dimension: 'Openness on Accountability',
				totals: { score: 0, totalApplicableScore: 0 },
				score: undefined
			},
			{
				dimension: 'Openness on Citizen Participation',
				totals: { score: 0, totalApplicableScore: 0 },
				score: undefined
			}
		]);
	});
});

describe('getChamberScore', () => {
	const bicameral = [
		...asAnswers(['Openness on Information-1', 1, 1], ['Openness on Accountability-1', 0, 1]),
		...asAnswers(['Openness on Information-1', 0, 1], ['Openness on Accountability-1', 1, 2]).map(
			(answer) => ({ ...answer, chamber: 'Upper' as const })
		)
	];

	it('scores a single chamber', () => {
		expect(getChamberScore(bicameral, 'Lower')).toBe(50);
		expect(getChamberScore(bicameral, 'Upper')).toBeCloseTo(100 / 3);
	});

	it('pools both chambers into one set of answers', () => {
		expect(getChamberScore(bicameral, 'Both')).toBe(40);
	});

	it('leaves both chambers undefined when a chamber is missing', () => {
		const unicameral = asAnswers(['Openness on Information-1', 1, 1]);

		expect(getChamberScore(unicameral, 'Lower')).toBe(100);
		expect(getChamberScore(unicameral, 'Both')).toBeUndefined();
	});

	it('scores each dimension across both chambers', () => {
		expect(getChamberDimensionScores(bicameral, 'Both', dimensionOf)).toEqual([
			{
				dimension: 'Openness on Information',
				totals: { score: 1, totalApplicableScore: 2 },
				score: 50
			},
			{
				dimension: 'Openness on Accountability',
				totals: { score: 1, totalApplicableScore: 3 },
				score: expect.closeTo(100 / 3)
			},
			{
				dimension: 'Openness on Citizen Participation',
				totals: { score: 0, totalApplicableScore: 0 },
				score: undefined
			}
		]);
	});
});
