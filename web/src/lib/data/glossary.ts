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
