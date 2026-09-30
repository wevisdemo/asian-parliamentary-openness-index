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
import { isOptionState, optionStates } from '$lib/constants/option-states';
import { parseAnswerOption, splitNonEmptyLines } from '$lib/data/transformers';

const spreadsheet = Spreadsheet('1DJ_56YByUW0PeXaPFM5_cGosSZbMhSDo');

const isOptionLine = (line: string) => /^[a-z]\)/.test(line);

/**
 * Keeps non-option lines such as `Select all that apply` as hints
 */
export const asSurveyOptions = createTransformer({
	decode: (value: string) => {
		const lines = splitNonEmptyLines(value);

		return {
			options: lines.filter(isOptionLine).map(parseAnswerOption),
			hints: lines.filter((line) => !isOptionLine(line))
		};
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

export const choiceKey = (question: SurveyQuestion, option?: string) =>
	option ? `${question.number}.${option}` : question.number;

export const questionElementId = (question: SurveyQuestion) => `question-${question.number}`;

const isSingleChoice = (question: SurveyQuestion, choice?: string) =>
	choice === 'n/a' || question.answerOptions.options.some(({ answer }) => answer === choice);

/**
 * A single answer only counts when it is still an option, since the sheet options may change after it was saved
 */
export const isAnswered = (question: SurveyQuestion, choices: SurveyDraft['choices']) =>
	question.answerType === 'single'
		? isSingleChoice(question, choices[choiceKey(question)])
		: question.answerOptions.options.every(({ answer }) => choices[choiceKey(question, answer)]);

const dependencyPattern = /Score this indicator only where (\d+[a-z]) scored above 0/i;

/** e.g. 12b is only scored where 12a scored above 0 */
export const findDependency = (question: SurveyQuestion, questions: SurveyQuestion[]) => {
	const dependencyNumber = dependencyPattern.exec(question.guidance ?? '')?.[1].toUpperCase();

	return questions.find(
		({ number, answerType }) => answerType === 'single' && number.toUpperCase() === dependencyNumber
	);
};

export const isUnscored = (question: SurveyQuestion, choices: SurveyDraft['choices']) => {
	const choice = choices[choiceKey(question)];

	return (
		choice === 'n/a' ||
		question.answerOptions.options.find(({ answer }) => answer === choice)?.score === 0
	);
};

/**
 * Answers N/A to every question whose dependency scored 0 or N/A, keeping the stored answers intact
 */
export const applyUnscoredDependencies = (
	questions: SurveyQuestion[],
	choices: SurveyDraft['choices']
): SurveyDraft['choices'] => ({
	...choices,
	...Object.fromEntries(
		questions
			.filter((question) => {
				const dependency = findDependency(question, questions);

				return dependency && isUnscored(dependency, choices);
			})
			.map((question) => [choiceKey(question), 'n/a'])
	)
});

const urlPattern = /^https?:\/\/\S+$/;

/**
 * The URL must start with http(s) since the data pipeline drops anything else from the evidences
 */
export const isReferenceComplete = ({ websiteName, url, accessedDate }: SurveyReference) =>
	websiteName.trim().length > 0 && urlPattern.test(url.trim()) && accessedDate.trim().length > 0;

/**
 * Encodes an answer the same way respondents fill the sheet, e.g. `a`, `n/a` or `a(yes);b(no);c(n/a)`.
 * Unanswered options are left out, so a work in progress survey can be exported
 */
export const encodeAnswer = (question: SurveyQuestion, choices: SurveyDraft['choices']) =>
	question.answerType === 'single'
		? isAnswered(question, choices)
			? choices[choiceKey(question)]
			: ''
		: question.answerOptions.options
				.map(({ answer }) => ({ answer, choice: choices[choiceKey(question, answer)] }))
				.filter(({ choice }) => isOptionState(choice))
				.map(({ answer, choice }) => `${answer}(${choice})`)
				.join(';');

export const decodeAnswer = (question: SurveyQuestion, response: string): [string, string][] => {
	const { options } = question.answerOptions;

	if (question.answerType === 'single') {
		return isSingleChoice(question, response) ? [[choiceKey(question), response]] : [];
	}

	const tokens = response.split(';').map((token) => token.trim());

	return options.flatMap(({ answer }): [string, string][] => {
		const key = choiceKey(question, answer);

		if (response === 'n/a' || tokens.includes(`${answer}(n/a)`)) {
			return [[key, 'n/a']];
		}

		const choice = optionStates.find((state) => tokens.includes(`${answer}(${state})`));

		return choice ? [[key, choice]] : [];
	});
};

export interface SurveyIndicator {
	number: number;
	name: string;
	questions: SurveyQuestion[];
}

export interface SurveyDimension {
	name: string;
	indicators: SurveyIndicator[];
}

export const groupSurveyQuestions = (questions: SurveyQuestion[]): SurveyDimension[] =>
	[...Map.groupBy(questions, (question) => question.dimension)].map(
		([name, dimensionQuestions]) => ({
			name,
			indicators: [...Map.groupBy(dimensionQuestions, (question) => question.indicatorNumber)].map(
				([number, questions]) => ({ number, name: questions[0].indicator, questions })
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
export const formatSurveyCsv = (questions: SurveyQuestion[], draft: SurveyDraft) => {
	const choices = applyUnscoredDependencies(questions, draft.choices);

	return formatToCsv(
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
					.map(({ answer, text, score }) => `${answer}) ${text} (${score})`)
					.join('\n'),
				answerType: question.answerType,
				response: encodeAnswer(question, choices),
				context: isFirstOfIndicator ? (draft.contexts[question.indicatorNumber] ?? '').trim() : '',
				urls: joinReferences('url'),
				websiteNames: joinReferences('websiteName'),
				accessedDates: joinReferences('accessedDate')
			};
		}),
		surveyCsvSchema
	);
};

export const surveyFileBaseName = ({
	country,
	chamber
}: Pick<SurveyDraft, 'country' | 'chamber'>) =>
	`${country.trim().toLowerCase().replaceAll(/\s+/g, '-')}-${chamber.toLowerCase()}-chamber`;

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Dated in local time down to the minute, so successive backups don't overwrite each other
 */
export const surveyFileName = (draft: Pick<SurveyDraft, 'country' | 'chamber'>, date: Date) =>
	`${surveyFileBaseName(draft)}-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}.csv`;

const splitLines = (value?: string) => (value ? value.split('\n') : []);

/**
 * Unlisted options stay unanswered, so a work in progress survey restores as it was
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
