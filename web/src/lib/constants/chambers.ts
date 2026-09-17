export const chambers = ['Lower', 'Upper'] as const;

export type Chamber = (typeof chambers)[number];

export const byChamber = <T>(getValue: (chamber: Chamber) => T) =>
	Object.fromEntries(chambers.map((chamber) => [chamber, getValue(chamber)])) as Record<Chamber, T>;

export const chamberOptions = chambers.map((chamber) => ({
	label: `${chamber} chamber`,
	value: chamber
}));
