import { marked, Renderer } from 'marked';
import { asArray, asString, createTransformer } from 'sheethuahua';

/**
 * Transform a column holding one url per line into a list of urls
 */
export const asUrlList = asArray(asString(), '\n');

/**
 * Transform a column into an url-friendly slug
 */
export const asSlug = createTransformer({
	decode: (value: string) => value.toLowerCase().replaceAll(' ', '-')
});

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

/**
 * Transform a column of inline markdown into html, with links opening in a new tab
 */
export const asMarkdownHtml = createTransformer({
	decode: parseInlineMarkdown
});
