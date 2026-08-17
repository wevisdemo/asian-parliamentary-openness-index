import { marked } from 'marked';
import {
	asString,
	Column,
	createTransformer,
	Object,
	Spreadsheet,
	type StaticDecode
} from 'sheethuahua';

const spreadsheet = Spreadsheet('1udHPvoDQKQ9_ziyqwTObWgI1dEKTVLnm');

const asMarkdownHtml = createTransformer({
	decode: (value: string) => marked.parseInline(value, { async: false })
});

export const glossaryTermSchema = Object({
	term: Column('Terms', asString()),
	definition: Column('Definition', asMarkdownHtml)
});

export type GlossaryTerm = StaticDecode<typeof glossaryTermSchema>;

export const getGlossary = (): Promise<GlossaryTerm[]> =>
	spreadsheet.get('Glossary', glossaryTermSchema);

const abbreviationPattern = /^(.+?)\s*\((.+)\)$/;

/**
 * Every wording a term can be referred to by, e.g.
 * `Freedom of Information (FOI) / Rights to Information (RTI)` yields all four wordings.
 */
export const getTermAliases = (term: string): string[] =>
	term
		.split('/')
		.map((part) => part.trim())
		.flatMap((part) => {
			const match = abbreviationPattern.exec(part);

			return match ? [match[1], match[2]] : [part];
		})
		.filter(Boolean);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createTermPattern = (terms: GlossaryTerm[]): RegExp | undefined => {
	const patterns = terms
		.flatMap(({ term }) => getTermAliases(term))
		.sort((a, b) => b.length - a.length)
		.map(escapeRegExp);

	return patterns.length ? new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi') : undefined;
};

export interface ContentSegment {
	text: string;
	isTerm: boolean;
}

export const splitContentByTerm = (content: string, terms: GlossaryTerm[]): ContentSegment[] => {
	const pattern = createTermPattern(terms);
	const matches = pattern ? [...content.matchAll(pattern)] : [];
	const endOf = (match: RegExpExecArray) => (match.index ?? 0) + match[0].length;

	const parts = matches.flatMap((match, index) => {
		const previous = matches[index - 1];

		return [
			{ text: content.slice(previous ? endOf(previous) : 0, match.index), isTerm: false },
			{ text: match[0], isTerm: true }
		];
	});

	const last = matches.at(-1);

	return [...parts, { text: content.slice(last ? endOf(last) : 0), isTerm: false }].filter(
		({ text }) => text
	);
};

export const findTermByAlias = (
	terms: GlossaryTerm[],
	alias: string | undefined
): GlossaryTerm | undefined =>
	alias
		? terms.find(({ term }) =>
				getTermAliases(term).some((each) => each.toLowerCase() === alias.toLowerCase())
			)
		: undefined;
