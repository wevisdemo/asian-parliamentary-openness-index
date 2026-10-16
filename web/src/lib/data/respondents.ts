import respondentsCsv from '$data/respondents.csv?raw';
import {
	asArray,
	asString,
	Column,
	Object as ObjectSchema,
	parseCsv,
	type StaticDecode
} from 'sheethuahua';
import { asMarkdownHtml } from '$lib/data/transformers';

export const respondentSchema = ObjectSchema({
	country: Column('Country', asString()),
	names: Column('Name/s of respondent/s', asArray(asString()).optional()),
	email: Column('Email/s of respondent/s to correspond with', asString().optional()),
	organization: Column(
		'Representative Parliament Monitoring Organization (PMO) of respondent',
		asString().optional()
	),
	monitoringSince: Column(
		'In what year did the organization begin monitoring Parliament? \nPlease provide the starting year (e.g., 2026). If not applicable, answer “Not applicable.”',
		asString().optional()
	),
	about: Column('Introduction of the PMO (Use 100 words maximum)', asMarkdownHtml.optional())
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
		({ names, email, organization, monitoringSince, about }) =>
			names || email || organization || monitoringSince || about
	)
	.map((respondent) => ({
		...respondent,
		organizationLogo: respondent.organization
			? organizationLogos.get(respondent.organization.replaceAll('/', '-'))
			: undefined
	}));
