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
