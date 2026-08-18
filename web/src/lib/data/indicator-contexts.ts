import indicatorContextsCsv from '$data/indicator-contexts.csv?raw';
import {
	asArray,
	asNumber,
	asOneOf,
	asString,
	Column,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { chambers } from '$lib/constants/chambers';

export const indicatorContextSchema = Object({
	country: Column('Country', asString()),
	chamber: Column('Chamber', asOneOf(chambers)),
	indicatorNumber: Column('Indicator Number', asNumber()),
	context: Column('Context', asString().optional()),
	evidences: Column('Evidences', asArray(asString(), '\n').optional([]))
});

export type IndicatorContext = StaticDecode<typeof indicatorContextSchema>;

export const indicatorContexts: IndicatorContext[] = parseCsv(
	indicatorContextsCsv,
	indicatorContextSchema
);
