import countriesCsv from '$data/countries.csv?raw';
import {
	asOneOf,
	asString,
	Column,
	createTransformer,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { parliamentTypes } from './enums';

const asSlug = createTransformer({
	decode: (value: string) => value.toLowerCase().replaceAll(' ', '-')
});

export const countrySchema = Object({
	slug: Column('Country', asSlug),
	name: Column('Country', asString()),
	parliamentType: Column('Is the Parliament unicameral or bicameral?', asOneOf(parliamentTypes)),
	governmentSystem: Column(
		'How is the system of government classified in this jurisdiction?',
		asString()
	),
	parliamentName: Column('What is the name of the Parliament you will be assessing?', asString()),
	parliamentWebsite: Column('Provide the link to the Parliament’s official website', asString()),
	keyFindings: Column('Key findings', asString())
});

export type Country = StaticDecode<typeof countrySchema>;

export const countries: Country[] = parseCsv(countriesCsv, countrySchema);
