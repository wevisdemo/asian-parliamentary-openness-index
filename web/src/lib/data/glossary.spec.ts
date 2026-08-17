import { describe, expect, it } from 'vitest';
import {
	createTermPattern,
	findTermByAlias,
	getTermAliases,
	splitContentByTerm,
	type GlossaryTerm
} from './glossary';

const asTerms = (...terms: string[]): GlossaryTerm[] =>
	terms.map((term) => ({ term, definition: `<p>${term}</p>` }));

describe('getTermAliases', () => {
	it('keeps a plain term as its only alias', () => {
		expect(getTermAliases('Ad hoc basis')).toEqual(['Ad hoc basis']);
	});

	it('splits alternatives written with a slash', () => {
		expect(getTermAliases('Convention / Custom')).toEqual(['Convention', 'Custom']);
	});

	it('keeps multi word alternatives intact', () => {
		expect(getTermAliases('Creative Commons / Open license')).toEqual([
			'Creative Commons',
			'Open license'
		]);
	});

	it('expands an abbreviation into the full wording and the abbreviation', () => {
		expect(getTermAliases('Members of Parliament (MPs)')).toEqual(['Members of Parliament', 'MPs']);
	});

	it('expands abbreviations on both sides of a slash', () => {
		expect(getTermAliases('Freedom of Information (FOI) / Rights to Information (RTI)')).toEqual([
			'Freedom of Information',
			'FOI',
			'Rights to Information',
			'RTI'
		]);
	});
});

describe('createTermPattern', () => {
	it('returns nothing when there are no terms', () => {
		expect(createTermPattern([])).toBeUndefined();
	});

	it('escapes regex characters so terms are matched literally', () => {
		const pattern = createTermPattern(asTerms('U.S. Congress'));

		expect('the U.S. Congress'.match(pattern!)).toEqual(['U.S. Congress']);
		expect('the UxSx Congress'.match(pattern!)).toBeNull();
	});

	it('splits an abbreviation out of its parentheses', () => {
		const pattern = createTermPattern(asTerms('Cost (per capita)'));

		expect('Cost (per capita) rose'.match(pattern!)).toEqual(['Cost', 'per capita']);
	});
});

describe('splitContentByTerm', () => {
	const terms = asTerms(
		'Chamber',
		'Lower Chamber',
		'Upper Chamber',
		'Bill',
		'Members of Parliament (MPs)',
		'Convention / Custom'
	);

	const annotate = (content: string) =>
		splitContentByTerm(content, terms)
			.map(({ text, isTerm }) => (isTerm ? `[${text}]` : text))
			.join('');

	it('leaves content without any term untouched', () => {
		expect(splitContentByTerm('Nothing to see here', terms)).toEqual([
			{ text: 'Nothing to see here', isTerm: false }
		]);
	});

	it('returns segments that rejoin into the original content', () => {
		const content = 'The Upper Chamber debated a bill raised by MPs.';

		expect(
			splitContentByTerm(content, terms)
				.map(({ text }) => text)
				.join('')
		).toBe(content);
	});

	it('matches regardless of casing, keeping the original casing', () => {
		expect(annotate('a bill and a Bill')).toBe('a [bill] and a [Bill]');
	});

	it('does not match a term inside a longer word', () => {
		expect(annotate('Billing is unrelated')).toBe('Billing is unrelated');
	});

	it('prefers the longest term when they overlap', () => {
		expect(annotate('the Upper Chamber and the lower chamber and any chamber')).toBe(
			'the [Upper Chamber] and the [lower chamber] and any [chamber]'
		);
	});

	it('matches an abbreviation as well as its full wording', () => {
		expect(annotate('MPs are Members of Parliament')).toBe('[MPs] are [Members of Parliament]');
	});

	it('matches either side of a slash separated term', () => {
		expect(annotate('by convention, not custom')).toBe('by [convention], not [custom]');
	});

	it('keeps adjacent terms as separate segments', () => {
		expect(splitContentByTerm('Bill Chamber', terms)).toEqual([
			{ text: 'Bill', isTerm: true },
			{ text: ' ', isTerm: false },
			{ text: 'Chamber', isTerm: true }
		]);
	});
});

describe('findTermByAlias', () => {
	const terms = asTerms('Members of Parliament (MPs)', 'Convention / Custom');

	it('finds a term by its abbreviation', () => {
		expect(findTermByAlias(terms, 'MPs')?.term).toBe('Members of Parliament (MPs)');
	});

	it('finds a term by one of its slash separated alternatives', () => {
		expect(findTermByAlias(terms, 'custom')?.term).toBe('Convention / Custom');
	});

	it('ignores casing', () => {
		expect(findTermByAlias(terms, 'mPs')?.term).toBe('Members of Parliament (MPs)');
	});

	it('returns nothing for an unknown or missing alias', () => {
		expect(findTermByAlias(terms, 'Quorum')).toBeUndefined();
		expect(findTermByAlias(terms, undefined)).toBeUndefined();
	});
});
