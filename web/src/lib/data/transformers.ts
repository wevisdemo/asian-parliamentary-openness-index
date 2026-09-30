import { marked, Renderer } from 'marked';
import { asArray, asString, createTransformer } from 'sheethuahua';

/**
 * Transform a column holding one url per line into a list of urls
 */
export const asUrlList = asArray(asString(), '\n');

export const asSlug = createTransformer({
	decode: (value: string) => value.toLowerCase().replaceAll(' ', '-')
});

export const splitNonEmptyLines = (value: string) =>
	value
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

const answerOptionPattern = /^([a-z])\)\s*(.*?)\s*\(([\d.]+)\)$/;

/**
 * Decodes a line of `a) Completely accessible (1)` into `{ answer, text, score }`
 */
export const parseAnswerOption = (line: string) => {
	const match = answerOptionPattern.exec(line);

	if (!match) {
		throw new Error(`Option "${line}" is not in the "a) Text (1)" format`);
	}

	const [, answer, text, score] = match;

	return { answer, text, score: Number(score) };
};

const renderer = new Renderer();

renderer.link = function ({ href, title, tokens }) {
	const text = this.parser.parseInline(tokens);
	const titleAttr = title ? ` title="${title}"` : '';

	return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

/**
 * Render inline markdown into html, with links opening in a new tab
 */
export const parseInlineMarkdown = (value: string) =>
	marked.parseInline(value, { async: false, renderer });

export const asMarkdownHtml = createTransformer({
	decode: parseInlineMarkdown
});
