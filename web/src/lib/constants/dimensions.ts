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

// TODO: Replace with the final copy from the methodology
export const dimensionDescriptions: Record<Dimension, string> = {
	Transparency:
		'How a parliament proactively discloses legislative activities and decision-making processes.',
	Accountability:
		'How a parliament answers for its decisions and upholds the integrity of its members, including the mechanisms citizens can use to hold it to account.',
	'Citizen Participation':
		'How a parliament opens its work to the public, from access to its premises to meaningful involvement in the legislative process.'
};
