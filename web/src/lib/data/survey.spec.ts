import { describe, expect, it } from 'vitest';
import { asString, Column, Object, parseCsv } from 'sheethuahua';
import {
	createSurveyDraft,
	encodeAnswer,
	formatSurveyCsv,
	groupSurveyQuestions,
	isAnswered,
	isReferenceComplete,
	parseSurveyCsv,
	surveyQuestionSchema,
	type SurveyQuestion
} from './survey';

const header =
	'Indicator no.,Indicator,Dimension,Theme,Index no.,Indicator Question,Answer options,Guidance to selecting answer options,answer_type';

const parseQuestions = (...rows: string[]) =>
	parseCsv([header, ...rows].join('\n'), surveyQuestionSchema);

const [single, multiple, secondOfIndicator, otherDimension] = parseQuestions(
	'1,Code,Accountability,Integrity,1,Is there a code?,"a) Yes. (1)\nb) No (0)",Some guidance,2 choices',
	'2,Formats,Information,Useability,2A,Which are published?,"Select all that apply\na) Register (0.125)\nb) Votes (0.125)",,multi-select',
	'2,Formats,Information,Useability,2B,Which are machine readable?,"a) Register (0.333)\nb) Votes (0.333)",,multi-select',
	'3,Petitions,Participation,Queries,3,Is there a petition?,"a) Yes (1)\nb) No (0)",,3 choices'
);

describe('survey question schema', () => {
	it('decodes options and keeps non-option lines as hints', () => {
		expect(multiple.answerOptions).toEqual({
			options: [
				{ letter: 'a', text: 'Register', score: 0.125 },
				{ letter: 'b', text: 'Votes', score: 0.125 }
			],
			hints: ['Select all that apply']
		});
	});

	it('rejects an option without a score', () => {
		expect(() =>
			parseQuestions('1,Code,A,T,1,Q?,"a) No (0)\nb) Available (0.33 or 0.34)",,2 choices')
		).toThrow();
	});
});

describe('encodeAnswer', () => {
	it('lists every answered option of a multiple answer, leaving unanswered options out', () => {
		expect(encodeAnswer(multiple, { '2A.a': 'no', '2A.b': 'n/a' })).toBe('a(no);b(n/a)');
		expect(encodeAnswer(multiple, { '2A.a': 'yes', '2A.b': 'n/a' })).toBe('a(yes);b(n/a)');
		expect(encodeAnswer(multiple, { '2A.a': 'no', '2A.b': 'no' })).toBe('a(no);b(no)');
		expect(encodeAnswer(multiple, { '2A.b': 'yes' })).toBe('b(yes)');
		expect(encodeAnswer(multiple, {})).toBe('');
	});
});

describe('isAnswered', () => {
	it('needs every option of a multiple answer', () => {
		expect(isAnswered(multiple, { '2A.a': 'yes' })).toBe(false);
		expect(isAnswered(multiple, { '2A.a': 'yes', '2A.b': 'no' })).toBe(true);
	});

	it('ignores a single answer that is no longer an option', () => {
		expect(isAnswered(single, { 1: 'n/a' })).toBe(true);
		expect(isAnswered(single, { 1: 'd' })).toBe(false);
		expect(encodeAnswer(single, { 1: 'd' })).toBe('');
	});
});

describe('isReferenceComplete', () => {
	const reference = {
		websiteName: 'Parliament',
		url: 'https://a.example',
		accessedDate: '2026-01-01'
	};

	it('needs an http url since the data pipeline drops anything else', () => {
		expect(isReferenceComplete({ ...reference, url: 'www.a.example' })).toBe(false);
		expect(isReferenceComplete({ ...reference, url: ' http://a.example ' })).toBe(true);
	});
});

describe('groupSurveyQuestions', () => {
	it('groups by dimension, theme and indicator in sheet order', () => {
		const numbers = (questions: SurveyQuestion[]) => questions.map(({ number }) => number);

		expect(
			groupSurveyQuestions([otherDimension, single, multiple, secondOfIndicator]).map(
				({ name, themes }) => [
					name,
					themes.map(({ name, indicators }) => [
						name,
						indicators.map(({ number, name, questions }) => [number, name, numbers(questions)])
					])
				]
			)
		).toEqual([
			['Participation', [['Queries', [[3, 'Petitions', ['3']]]]]],
			['Accountability', [['Integrity', [[1, 'Code', ['1']]]]]],
			['Information', [['Useability', [[2, 'Formats', ['2A', '2B']]]]]]
		]);
	});
});

describe('formatSurveyCsv', () => {
	const outputSchema = Object({
		section: Column('Section', asString()),
		indicator: Column('Indicator', asString()),
		indicatorNo: Column('Indicator no.', asString()),
		question: Column('Question', asString()),
		answerOptions: Column('Answer Options', asString()),
		answerType: Column('answer_type', asString()),
		response: Column('Country Assessment Response', asString().optional()),
		context: Column('Country context for section', asString().optional()),
		urls: Column('Evidence Sources (URLs)', asString().optional()),
		websiteNames: Column('Evidence Sources (website name)', asString().optional()),
		accessedDates: Column('Evidence Sources (last accessed date)', asString().optional())
	});

	const [first, second] = parseCsv(
		formatSurveyCsv([multiple, secondOfIndicator], {
			...createSurveyDraft(),
			choices: { '2A.a': 'yes', '2A.b': 'n/a', '2B.a': 'no', '2B.b': 'yes' },
			contexts: { 2: ' Published as PDF ' },
			references: {
				2: [
					{ websiteName: 'Parliament', url: 'https://a.example', accessedDate: '2026-01-01' },
					{ websiteName: 'Gazette', url: 'https://b.example', accessedDate: '2026-02-01' }
				]
			}
		}),
		outputSchema
	);

	it('writes the old chamber sheet columns', () => {
		expect(first).toMatchObject({
			section: '2',
			indicator: '2A',
			indicatorNo: '1',
			question: 'Which are published?',
			answerOptions: 'a) Register (0.125)\nb) Votes (0.125)',
			answerType: 'multiple',
			response: 'a(yes);b(n/a)'
		});
		expect(second).toMatchObject({ indicator: '2B', indicatorNo: '2', response: 'a(no);b(yes)' });
	});

	it('writes context and references line by line on the first row of an indicator only', () => {
		expect(first).toMatchObject({
			context: 'Published as PDF',
			urls: 'https://a.example\nhttps://b.example',
			websiteNames: 'Parliament\nGazette',
			accessedDates: '2026-01-01\n2026-02-01'
		});
		expect([second.context, second.urls, second.websiteNames, second.accessedDates]).toEqual([
			undefined,
			undefined,
			undefined,
			undefined
		]);
	});
});

describe('parseSurveyCsv', () => {
	const questions = [single, multiple, secondOfIndicator];

	it('restores a draft from a generated csv', () => {
		const draft = {
			choices: {
				1: 'n/a',
				'2A.a': 'yes',
				'2A.b': 'n/a',
				'2B.a': 'no',
				'2B.b': 'yes'
			},
			contexts: { 2: 'Published as PDF' },
			references: {
				1: [{ websiteName: 'Parliament', url: '', accessedDate: '2026-01-01' }],
				2: [
					{ websiteName: 'Parliament', url: 'https://a.example', accessedDate: '2026-01-01' },
					{ websiteName: 'Gazette', url: 'https://b.example', accessedDate: '2026-02-01' }
				]
			}
		};

		expect(
			parseSurveyCsv(formatSurveyCsv(questions, { ...createSurveyDraft(), ...draft }), questions)
		).toEqual(draft);
	});

	it('restores an all no and a partial multiple answer', () => {
		const choices = { '2A.a': 'no', '2A.b': 'no', '2B.b': 'yes' };
		const csv = formatSurveyCsv(questions, { ...createSurveyDraft(), choices });

		expect(parseSurveyCsv(csv, questions).choices).toEqual(choices);
	});

	it('leaves empty answers, unknown letters and removed questions unanswered', () => {
		const csv = formatSurveyCsv(questions, {
			...createSurveyDraft(),
			choices: { 1: 'b', '2A.a': 'yes' }
		}).replace(',b,', ',z,');

		expect(parseSurveyCsv(csv, [secondOfIndicator]).choices).toEqual({});
		expect(parseSurveyCsv(csv, questions).choices).toEqual({ '2A.a': 'yes' });
		expect(parseSurveyCsv(csv.replace('a(yes)', 'a'), questions).choices).toEqual({});
	});
});
