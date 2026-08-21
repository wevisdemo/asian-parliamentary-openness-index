import { asNumber, asString, Column, Object, Spreadsheet, type StaticDecode } from 'sheethuahua';

const spreadsheet = Spreadsheet('1gvM7VEtzlpXcGOMPBp3_zByt7yIkMwsvd67hl-QXjVk');

export const cycleSchema = Object({
	year: Column('Cycle', asNumber()),
	assessmentDate: Column('Assessment date', asString())
});

export type Cycle = StaticDecode<typeof cycleSchema>;

export const getCycles = async (): Promise<Cycle[]> =>
	(await spreadsheet.get('survey cycle context', cycleSchema)).toSorted((a, b) => b.year - a.year);
