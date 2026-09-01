export const dimensions = ['Transparency', 'Accountability', 'Citizen Participation'] as const;

export type Dimension = (typeof dimensions)[number];

export const dimensionOptions = dimensions.map((dimension) => ({
	label: dimension,
	value: dimension
}));

export const dimensionSlugs = Object.fromEntries(
	dimensions.map((dimension) => [dimension, dimension.toLowerCase().replaceAll(' ', '-')])
) as Record<Dimension, string>;

export const toDimension = (slug?: string | null): Dimension | undefined =>
	dimensions.find((dimension) => dimensionSlugs[dimension] === slug);

export const dimensionDescriptions: Record<Dimension, string> = {
	Transparency:
		'How a parliament proactively discloses comprehensive legislative, financial, administrative, and procedural data in accessible formats.',
	Accountability:
		'The extent to which individual legislators are held responsible for ethical conduct and the legislative institution remains answerable to the public for its governance and laws.',
	'Citizen Participation':
		'The extent to which citizens can meaningfully engage in and express opinions about parliamentary processes.'
};

export const dimensionDetailedDescriptions: Record<Dimension, string> = {
	Transparency:
		'Examines how proactively a parliament discloses comprehensive legislative, financial, administrative, and procedural data in accessible formats. Key indicators cover session proceedings, schedules, and voting records; draft laws and budget documents; MP profiles and parliamentary spending; and legal frameworks for freedom of information.',
	Accountability:
		'Examines the extent to which individual legislators are held responsible for ethical conduct and the legislative institution remains answerable to the public for its governance and laws. Key indicators cover MP integrity mechanisms (codes of conduct, asset disclosures, and conflicts of interest), pre- and post-legislative scrutiny of laws, and systemized handling of public queries.',
	'Citizen Participation':
		'Examines the extent to which citizens can meaningfully engage in and express their opinions about parliamentary processes. Key indicators cover physical and digital access (including disability accessibility standards) and public consultation mechanisms across all stages of the legislative lifecycle.'
};

export const dimensionKeyIndicators: Record<Dimension, string> = {
	Transparency:
		'Key indicators cover session proceedings, schedules, and voting records; draft laws and budget documents; MP profiles and parliamentary spending; and legal freedom-of-information frameworks.',
	Accountability:
		'Key indicators cover MP integrity mechanisms (codes of conduct, asset disclosures, and conflicts of interest), pre- and post-legislative scrutiny of laws, and systemized handling of public queries.',
	'Citizen Participation':
		'Key indicators cover physical and digital access (including disability accessibility standards) and public consultation mechanisms across all stages of the legislative lifecycle.'
};
