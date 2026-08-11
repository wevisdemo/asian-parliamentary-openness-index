export const parliamentTypes = ['Unicameral', 'Bicameral'] as const;

export type ParliamentType = (typeof parliamentTypes)[number];
