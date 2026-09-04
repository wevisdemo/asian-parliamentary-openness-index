export const achievementLevels = ['Not achieved', 'Partly achieved', 'Achieved', 'N/A'] as const;

export type AchievementLevel = (typeof achievementLevels)[number];

export const achievementLevelColorClasses: Record<AchievementLevel, string> = {
	'Not achieved': 'bg-data-not-achieved',
	'Partly achieved': 'bg-data-partly-achieved',
	Achieved: 'bg-data-achieved',
	'N/A': 'bg-data-na'
};

export const achievementLevelTabColorClasses: Record<
	AchievementLevel,
	{ default: string; selected: string }
> = {
	'Not achieved': {
		default: 'border-data-not-achieved text-black hover:bg-data-not-achieved/20',
		selected: 'border-data-not-achieved bg-data-not-achieved font-bold text-black'
	},
	'Partly achieved': {
		default: 'border-data-partly-achieved text-black hover:bg-data-partly-achieved/20',
		selected: 'border-data-partly-achieved bg-data-partly-achieved font-bold text-black'
	},
	Achieved: {
		default: 'border-data-achieved text-black hover:bg-data-achieved/20',
		selected: 'border-data-achieved bg-data-achieved font-bold text-black'
	},
	'N/A': {
		default: 'border-data-na text-black hover:bg-data-na/20',
		selected: 'border-data-na bg-data-na font-bold text-black'
	}
};

export const achievementLevelDescriptions: Record<AchievementLevel, string> = {
	Achieved:
		'All questions within the indicator receive a full score, excluding those that are not applicable to the country context.',
	'Partly achieved':
		'The indicator receives some score, excluding those that are not applicable to the country context.',
	'Not achieved':
		'All questions within the indicator receive a score of 0, excluding those that are not applicable to the country context.',
	'N/A': 'All questions within the indicator are not applicable to the country context.'
};
