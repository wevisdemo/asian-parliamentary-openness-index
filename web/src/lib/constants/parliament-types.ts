export const parliamentTypes = ['unicameral', 'bicameral'] as const;

export type ParliamentType = (typeof parliamentTypes)[number];
