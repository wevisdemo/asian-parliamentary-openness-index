import respondentsCsv from '$data/respondents.csv?raw';
import {
	asArray,
	asString,
	Column,
	Object as ObjectSchema,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';

export const respondentSchema = ObjectSchema({
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

export type Respondent = StaticDecode<typeof respondentSchema> & {
	organizationLogo?: string;
};

const logoUrlByFileName = import.meta.glob<string>('$lib/assets/images/organizations/*.png', {
	eager: true,
	import: 'default'
});

const organizationLogos = new Map(
	Object.entries(logoUrlByFileName).map(([path, url]) => [
		path
			.split('/')
			.at(-1)!
			.replace(/\.[^.]+$/, ''),
		url
	])
);

export const respondents: Respondent[] = parseCsv(respondentsCsv, respondentSchema)
	.filter(
		({ names, email, organization, yearsOfExperience, about }) =>
			names || email || organization || yearsOfExperience || about
	)
	.map((respondent) => ({
		...respondent,
		organizationLogo: respondent.organization
			? organizationLogos.get(respondent.organization)
			: undefined
	}));
