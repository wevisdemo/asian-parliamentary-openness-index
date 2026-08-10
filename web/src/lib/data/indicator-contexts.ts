import indicatorContextsCsv from '$data/indicator-contexts.csv?raw';
import {
	asNumber,
	asOneOf,
	asString,
	Column,
	createTransformer,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { chambers } from '$lib/constants/chambers';

/** Splits newline-separated links, `asArray` can't be used since it treats newline as a row break */
const asLines = createTransformer({
	decode: (value: string) =>
		value
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
});

export const indicatorContextSchema = Object({
	country: Column('Country', asString()),
	chamber: Column('Chamber', asOneOf(chambers)),
	indicatorNumber: Column('Indicator Number', asNumber()),
	context: Column('Context', asString().optional()),
	evidences: Column('Evidences', asLines.optional([]))
});

export type IndicatorContext = StaticDecode<typeof indicatorContextSchema>;

export const indicatorContexts: IndicatorContext[] = parseCsv(
	indicatorContextsCsv,
	indicatorContextSchema
);
