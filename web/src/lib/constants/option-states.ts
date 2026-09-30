export const optionStates = ['yes', 'no', 'n/a'] as const;

export type OptionState = (typeof optionStates)[number];

export const isOptionState = (value?: string): value is OptionState =>
	(optionStates as readonly (string | undefined)[]).includes(value);
