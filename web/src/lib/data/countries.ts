import countriesCsv from '$data/countries.csv?raw';
import {
	asDate,
	asOneOf,
	asString,
	Column,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { parliamentTypes } from '$lib/constants/parliament-types';
import { asSlug, asUrlList } from '$lib/data/transformers';

/**
 * Pair a country context answer with its optional remark from the sheet's `Remark (if any)` column
 */
const AnswerWithRemark = <T extends Parameters<typeof Column>[1]>(name: string, transformer: T) =>
	Object({
		answer: Column(name, transformer),
		remark: Column(`Remark: ${name}`, asString().optional())
	});

export const countrySchema = Object({
	slug: Column('Country', asSlug),
	name: Column('Country', asString()),
	parliamentType: AnswerWithRemark(
		'Is the Parliament unicameral or bicameral?',
		asOneOf(parliamentTypes)
	),
	governmentSystem: AnswerWithRemark(
		'How is the system of government classified in this jurisdiction?',
		asString()
	),
	parliamentName: AnswerWithRemark(
		'What is the name of the Parliament you will be assessing?',
		asString()
	),
	parliamentWebsites: AnswerWithRemark(
		'Provide the link to the Parliament’s official website',
		asUrlList
	),
	keyFindings: AnswerWithRemark(
		'Key findings of the Parliament assessment as relayed by the PMO (Use 200 words maximum)',
		asString().optional()
	),
	assessmentSentDate: AnswerWithRemark(
		'Date assessment was sent to Parliament (YYYY-MM-DD)',
		asDate({ emptyValues: ['', '-'] }).optional()
	)
});

export type Country = StaticDecode<typeof countrySchema>;

export const countries: Country[] = parseCsv(countriesCsv, countrySchema);
