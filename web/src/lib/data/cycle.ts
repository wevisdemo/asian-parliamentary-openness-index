import { asNumber, asString, Column, Object, Spreadsheet, type StaticDecode } from 'sheethuahua';
import { asMarkdownHtml } from '$lib/data/transformers';

const spreadsheet = Spreadsheet('1gvM7VEtzlpXcGOMPBp3_zByt7yIkMwsvd67hl-QXjVk');

export const cycleSchema = Object({
	year: Column('Cycle', asNumber()),
	assessmentDate: Column('Assessment date', asString()),
	overallKeyFindingsShort: Column('Overall Key Findings (short)', asMarkdownHtml),
	overallKeyFindingsFull: Column('Overall Key Findings (full)', asMarkdownHtml),
	dimensionKeyFindings: Column('Dimension Key Findings', asMarkdownHtml)
});

export type Cycle = StaticDecode<typeof cycleSchema>;

export const getCycles = async (): Promise<Cycle[]> =>
	(await spreadsheet.get('survey cycle context', cycleSchema)).toSorted((a, b) => b.year - a.year);
