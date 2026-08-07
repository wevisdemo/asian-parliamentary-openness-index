import indicatorsCsv from '$data/indicators.csv?raw';
import {
	asNumber,
	asOneOf,
	asString,
	Column,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { dimensions } from './enums';

export const indicatorSchema = Object({
	dimension: Column('Dimension', asOneOf(dimensions)),
	dimensionRelevance: Column('Dimension Relevance', asString()),
	number: Column('Indicator Number', asNumber()),
	name: Column('Indicator', asString())
});

export type Indicator = StaticDecode<typeof indicatorSchema>;

export const indicators: Indicator[] = parseCsv(indicatorsCsv, indicatorSchema);
