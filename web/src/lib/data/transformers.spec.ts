import { describe, expect, it } from 'vitest';
import { Column, Object, parseCsv } from 'sheethuahua';
import { asUrlList } from './transformers';

const schema = Object({ urls: Column('Urls', asUrlList) });

const decode = (value: string): string[] =>
	parseCsv(`Urls\n"${value.replaceAll('"', '""')}"`, schema)[0].urls;

describe('asUrlList', () => {
	it('keeps a single url as its only item', () => {
		expect(decode('https://www.assembly.go.kr/')).toEqual(['https://www.assembly.go.kr/']);
	});

	it('splits one url per line', () => {
		expect(decode('https://www.dpr.go.id/\nhttps://www.dpd.go.id/')).toEqual([
			'https://www.dpr.go.id/',
			'https://www.dpd.go.id/'
		]);
	});

	it('trims the whitespace left by a spreadsheet export', () => {
		expect(decode('https://www.parliament.mn ')).toEqual(['https://www.parliament.mn']);
	});
});
