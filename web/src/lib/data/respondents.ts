import respondentsCsv from '$data/respondents.csv?raw';
import {
	asArray,
	asNumber,
	asString,
	Column,
	Object,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';

export const respondentSchema = Object({
	country: Column('Country', asString()),
	names: Column('Name of respondent', asArray(asString())),
	email: Column('Email of respondent to correspond with', asString()),
	organization: Column(
		'Representative Parliament Monitoring Organization (PMO) of respondent',
		asString()
	),
	yearsOfExperience: Column(
		'Years of experience of parliament monitoring by the organization',
		asNumber()
	),
	about: Column('About the Respondent', asString())
});

export type Respondent = StaticDecode<typeof respondentSchema>;

export const respondents: Respondent[] = parseCsv(respondentsCsv, respondentSchema);
