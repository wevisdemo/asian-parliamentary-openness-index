import respondentsCsv from '$data/respondents.csv?raw';
import { asArray, asString, Column, Object, parseCsv, type StaticDecode } from 'sheethuahua';

export const respondentSchema = Object({
	country: Column('Country', asString()),
	names: Column('Name of respondent', asArray(asString()).optional()),
	email: Column('Email of respondent to correspond with', asString().optional()),
	organization: Column(
		'Representative Parliament Monitoring Organization (PMO) of respondent',
		asString().optional()
	),
	yearsOfExperience: Column(
		'Years of experience of parliament monitoring by the organization',
		asString().optional()
	),
	about: Column('About the Respondent', asString().optional())
});

export type Respondent = StaticDecode<typeof respondentSchema>;

export const respondents: Respondent[] = parseCsv(respondentsCsv, respondentSchema).filter(
	({ names, email, organization, yearsOfExperience, about }) =>
		names || email || organization || yearsOfExperience || about
);
