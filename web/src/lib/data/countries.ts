import indexCsv from '$data/index.csv?raw';

export interface Country {
	label: string;
	value: string;
}

const toSlug = (country: string) => country.trim().toLowerCase().replaceAll(' ', '-');

const [, ...rows] = indexCsv.trim().split('\n');

export const countries: Country[] = [...new Set(rows.map((row) => row.split(',')[0].trim()))].map(
	(label) => ({ label, value: toSlug(label) })
);
