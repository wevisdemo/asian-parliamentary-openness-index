export const achievementLevels = ['Not achieved', 'Partly achieved', 'Achieved', 'N/A'] as const;

export type AchievementLevel = (typeof achievementLevels)[number];

export const achievementLevelDescriptions: Record<AchievementLevel, string> = {
	Achieved:
		'All questions within the indicator receive a score of 0, excluding those that are not applicable to the country context.',
	'Partly achieved':
		'At least one question within the indicator does not receive a full score, excluding those that are not applicable to the country context.',
	'Not achieved':
		'All questions within the indicator receive a full score, excluding those that are not applicable to the country context.',
	'N/A': 'All questions within the indicator are not applicable to the country context.'
};
