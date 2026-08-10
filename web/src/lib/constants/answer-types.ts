export const answerTypes = ['single', 'multiple'] as const;

export type AnswerType = (typeof answerTypes)[number];
