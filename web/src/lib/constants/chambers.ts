export const chambers = ['Lower', 'Upper'] as const;

export type Chamber = (typeof chambers)[number];

export const byChamber = <T>(getValue: (chamber: Chamber) => T) =>
	Object.fromEntries(chambers.map((chamber) => [chamber, getValue(chamber)])) as Record<Chamber, T>;

export const chamberOptions = chambers.map((chamber) => ({
	label: `${chamber} chamber`,
	value: chamber
}));

export const surveyChamberOptions: { label: string; value: Chamber }[] = [
	{ label: 'Lower / sole chamber', value: 'Lower' },
	{ label: 'Upper chamber', value: 'Upper' }
];

export const chamberScopes = [...chambers, 'Both'] as const;

export type ChamberScope = (typeof chamberScopes)[number];

export const byChamberScope = <T>(getValue: (scope: ChamberScope) => T) =>
	Object.fromEntries(chamberScopes.map((scope) => [scope, getValue(scope)])) as Record<
		ChamberScope,
		T
	>;

export const chamberScopeOptions = [
	...chamberOptions,
	{ label: 'Both chambers', value: 'Both' as const }
];
