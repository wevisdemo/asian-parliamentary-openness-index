export const parliamentTypes = ['unicameral', 'bicameral'] as const;

export type ParliamentType = (typeof parliamentTypes)[number];

export const chambers = ['Lower', 'Upper'] as const;

export type Chamber = (typeof chambers)[number];

export const chamberOptions = chambers.map((chamber) => ({
	label: `${chamber} Chamber`,
	value: chamber
}));

export const dimensions = ['Transparency', 'Accountability', 'Citizen Participation'] as const;

export type Dimension = (typeof dimensions)[number];

export const dimensionOptions = dimensions.map((dimension) => ({
	label: dimension,
	value: dimension
}));

export const answerTypes = ['single', 'multiple'] as const;

export type AnswerType = (typeof answerTypes)[number];
