export const chambers = ['Lower', 'Upper'] as const;

export type Chamber = (typeof chambers)[number];

export const chamberOptions = chambers.map((chamber) => ({
	label: `${chamber} chamber`,
	value: chamber
}));
