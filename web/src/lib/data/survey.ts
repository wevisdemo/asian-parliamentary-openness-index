import {
	asNumber,
	asString,
	Column,
	createTransformer,
	formatToCsv,
	Object as ObjectSchema,
	parseCsv,
	Spreadsheet,
	type StaticDecode
} from 'sheethuahua';
import type { AnswerType } from '$lib/constants/answer-types';
import type { Chamber } from '$lib/constants/chambers';

const spreadsheet = Spreadsheet('1DJ_56YByUW0PeXaPFM5_cGosSZbMhSDo');

const optionPattern = /^([a-z])\)\s*(.*?)\s*\(([\d.]+)\)$/;

/**
 * Keeps non-option lines such as `Select all that apply` as hints
 */
export const asSurveyOptions = createTransformer({
	decode: (value: string) => {
		const lines = value
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		const options = lines
			.filter((line) => /^[a-z]\)/.test(line))
			.map((line) => {
				const match = optionPattern.exec(line);

				if (!match) {
					throw new Error(`Option "${line}" does not end with a score, e.g. "a) Text (1)"`);
				}

				const [, letter, text, score] = match;

				return { letter, text, score: Number(score) };
			});

		return { options, hints: lines.filter((line) => !/^[a-z]\)/.test(line)) };
	}
});

export const asSurveyAnswerType = createTransformer({
	decode: (value: string): AnswerType => {
		if (value === 'multi-select') {
			return 'multiple';
		}

		if (/^\d+ choices$/.test(value)) {
			return 'single';
		}

		throw new Error(`Answer type "${value}" is neither "N choices" nor "multi-select"`);
	}
});

export const surveyQuestionSchema = ObjectSchema({
	indicatorNumber: Column('Indicator no.', asNumber()),
	indicator: Column('Indicator', asString()),
	dimension: Column('Dimension', asString()),
	theme: Column('Theme', asString()),
	number: Column('Index no.', asString()),
	question: Column('Indicator Question', asString()),
	answerOptions: Column('Answer options', asSurveyOptions),
	guidance: Column('Guidance to selecting answer options', asString().optional()),
	answerType: Column('answer_type', asSurveyAnswerType)
});

export type SurveyQuestion = StaticDecode<typeof surveyQuestionSchema>;

export const getSurveyQuestions = () =>
	spreadsheet.get('Lower Chamber Assessment', surveyQuestionSchema);

export interface SurveyReference {
	websiteName: string;
	url: string;
	accessedDate: string;
}

export interface SurveyDraft {
	/** Keyed by question number for single answer, or `<question number>.<letter>` for each option of multiple answer */
	choices: Record<string, string>;
	contexts: Record<number, string>;
	references: Record<number, SurveyReference[]>;
	country: string;
	chamber: Chamber;
}

export const createSurveyDraft = (): SurveyDraft => ({
	choices: {},
	contexts: {},
	references: {},
	country: '',
	chamber: 'Lower'
});

export const choiceKey = (question: SurveyQuestion, letter?: string) =>
	letter ? `${question.number}.${letter}` : question.number;

export const questionElementId = (question: SurveyQuestion) => `question-${question.number}`;

const isSingleChoice = (question: SurveyQuestion, choice?: string) =>
	choice === 'n/a' || question.answerOptions.options.some(({ letter }) => letter === choice);

/**
 * A single answer only counts when it is still an option, since the sheet options may change after it was saved
 */
export const isAnswered = (question: SurveyQuestion, choices: SurveyDraft['choices']) =>
	question.answerType === 'single'
		? isSingleChoice(question, choices[choiceKey(question)])
		: question.answerOptions.options.every(({ letter }) => choices[choiceKey(question, letter)]);

const urlPattern = /^https?:\/\/\S+$/;

/**
 * The URL must start with http(s) since the data pipeline drops anything else from the evidences
 */
export const isReferenceComplete = ({ websiteName, url, accessedDate }: SurveyReference) =>
	websiteName.trim().length > 0 && urlPattern.test(url.trim()) && accessedDate.trim().length > 0;

/**
 * Encodes an answer the same way respondents fill the sheet, e.g. `a`, `n/a` or `a;c;d(n/a)` where unlisted options mean no
 */
export const encodeAnswer = (question: SurveyQuestion, choices: SurveyDraft['choices']) =>
	question.answerType === 'single'
		? isAnswered(question, choices)
			? choices[choiceKey(question)]
			: ''
		: question.answerOptions.options
				.map(({ letter }) => ({ letter, choice: choices[choiceKey(question, letter)] }))
				.filter(({ choice }) => choice === 'yes' || choice === 'n/a')
				.map(({ letter, choice }) => (choice === 'n/a' ? `${letter}(n/a)` : letter))
				.join(';');

export const decodeAnswer = (question: SurveyQuestion, answer: string): [string, string][] => {
	const { options } = question.answerOptions;

	if (question.answerType === 'single') {
		return isSingleChoice(question, answer) ? [[choiceKey(question), answer]] : [];
	}

	const tokens = answer.split(';').map((token) => token.trim());

	return options.map(({ letter }) => {
		if (answer === 'n/a' || tokens.includes(`${letter}(n/a)`)) {
			return [choiceKey(question, letter), 'n/a'];
		}

		return [choiceKey(question, letter), tokens.includes(letter) ? 'yes' : 'no'];
	});
};

export interface SurveyIndicator {
	number: number;
	name: string;
	questions: SurveyQuestion[];
}

export interface SurveyTheme {
	name: string;
	indicators: SurveyIndicator[];
}

export interface SurveyDimension {
	name: string;
	themes: SurveyTheme[];
}

export const groupSurveyQuestions = (questions: SurveyQuestion[]): SurveyDimension[] =>
	[...Map.groupBy(questions, (question) => question.dimension)].map(
		([name, dimensionQuestions]) => ({
			name,
			themes: [...Map.groupBy(dimensionQuestions, (question) => question.theme)].map(
				([name, themeQuestions]) => ({
					name,
					indicators: [...Map.groupBy(themeQuestions, (question) => question.indicatorNumber)].map(
						([number, questions]) => ({ number, name: questions[0].indicator, questions })
					)
				})
			)
		})
	);

const surveyCsvSchema = ObjectSchema({
	section: Column('Section', asNumber()),
	sectionName: Column('Section Name', asString()),
	dimension: Column('Dimension', asString()),
	dimensionRelevance: Column('Dimension Relevance', asString()),
	indicator: Column('Indicator', asString()),
	indicatorNo: Column('Indicator no.', asNumber()),
	question: Column('Question', asString()),
	answerOptions: Column('Answer Options', asString()),
	answerType: Column('answer_type', asString()),
	response: Column('Country Assessment Response', asString().optional()),
	context: Column('Country context for section', asString().optional()),
	urls: Column('Evidence Sources (URLs)', asString().optional()),
	websiteNames: Column('Evidence Sources (website name)', asString().optional()),
	accessedDates: Column('Evidence Sources (last accessed date)', asString().optional())
});

/**
 * Context and references go on the first row of each indicator only, where the data pipeline reads them
 */
export const formatSurveyCsv = (questions: SurveyQuestion[], draft: SurveyDraft) =>
	formatToCsv(
		questions.map((question, index) => {
			const isFirstOfIndicator =
				questions.find(({ indicatorNumber }) => indicatorNumber === question.indicatorNumber) ===
				question;
			const references = isFirstOfIndicator
				? (draft.references[question.indicatorNumber] ?? [])
				: [];
			const joinReferences = (field: keyof SurveyReference) =>
				references.map((reference) => reference[field].trim()).join('\n');

			return {
				section: question.indicatorNumber,
				sectionName: question.indicator,
				dimension: question.dimension,
				dimensionRelevance: question.theme,
				indicator: question.number,
				indicatorNo: index + 1,
				question: question.question,
				answerOptions: question.answerOptions.options
					.map(({ letter, text, score }) => `${letter}) ${text} (${score})`)
					.join('\n'),
				answerType: question.answerType,
				response: encodeAnswer(question, draft.choices),
				context: isFirstOfIndicator ? (draft.contexts[question.indicatorNumber] ?? '').trim() : '',
				urls: joinReferences('url'),
				websiteNames: joinReferences('websiteName'),
				accessedDates: joinReferences('accessedDate')
			};
		}),
		surveyCsvSchema
	);

const splitLines = (value?: string) => (value ? value.split('\n') : []);

/**
 * An empty multiple answer stays unanswered since it cannot tell all no apart from not answered
 */
export const parseSurveyCsv = (
	csv: string,
	questions: SurveyQuestion[]
): Omit<SurveyDraft, 'country' | 'chamber'> => {
	const rows = parseCsv(csv, surveyCsvSchema);

	return {
		choices: Object.fromEntries(
			rows.flatMap(({ indicator, response }) => {
				const question = questions.find(({ number }) => number === indicator);

				return question && response ? decodeAnswer(question, response) : [];
			})
		),
		contexts: Object.fromEntries(
			rows.flatMap(({ section, context }) => (context ? [[section, context]] : []))
		),
		references: Object.fromEntries(
			rows
				.filter(({ urls, websiteNames, accessedDates }) => urls || websiteNames || accessedDates)
				.map(({ section, urls, websiteNames, accessedDates }) => {
					const [urlLines, nameLines, dateLines] = [urls, websiteNames, accessedDates].map(
						splitLines
					);
					const length = Math.max(urlLines.length, nameLines.length, dateLines.length);

					return [
						section,
						Array.from({ length }, (_, index) => ({
							websiteName: nameLines[index] ?? '',
							url: urlLines[index] ?? '',
							accessedDate: dateLines[index] ?? ''
						}))
					];
				})
		)
	};
};
