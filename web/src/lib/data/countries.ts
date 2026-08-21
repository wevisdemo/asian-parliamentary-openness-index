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
import { parliamentTypes } from '$lib/constants/parliament-types';

const asSlug = createTransformer({
	decode: (value: string) => value.toLowerCase().replaceAll(' ', '-')
});

const asUrlList = createTransformer({
	decode: (value: string) =>
		value
			.split('\n')
			.map((url) => url.trim())
			.filter((url) => url.length > 0)
});

export const countrySchema = Object({
	slug: Column('Country', asSlug),
	name: Column('Country', asString()),
	parliamentType: Column('Is the Parliament unicameral or bicameral?', asOneOf(parliamentTypes)),
	parliamentTypeRemark: Column('Any remark for unicameral or bicamera?', asString().optional()),
	governmentSystem: Column(
		'How is the system of government classified in this jurisdiction?',
		asString()
	),
	parliamentName: Column('What is the name of the Parliament you will be assessing?', asString()),
	parliamentWebsites: Column('Provide the link to the Parliament’s official website', asUrlList),
	keyFindings: Column('Key findings', asString().optional())
});

export type Country = StaticDecode<typeof countrySchema>;

export const countries: Country[] = parseCsv(countriesCsv, countrySchema);
