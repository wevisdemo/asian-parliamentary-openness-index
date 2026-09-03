export const feedbackFormUrl =
	'https://docs.google.com/forms/d/e/1FAIpQLScm3bMHNxc1GsLgAzSH8yhXFxJovaGk97NlQsV83Up96tMAwA/viewform?usp=header';

export const feedbackCategories = [
	{
		title: 'Feedback on a country’s index score',
		description:
			'Choose this option if you believe the index score for a specific country does not accurately reflect the current situation or available evidence.',
		criteriaLabel: 'You may submit feedback if you believe that:',
		criteria: [
			'The score does not reflect the reality of the country.',
			'The score or underlying information appears to be incorrect or inaccurate.',
			'The score or supporting data needs to be reviewed or revised.',
			'You have relevant information or evidence that may help clarify the assessment.'
		],
		whatHappensNext:
			'Your feedback will be shared with the responsible survey respondent for the country concerned. They will review the information and, where appropriate, recheck the assessment and make adjustments through the relevant review process.'
	},
	{
		title: 'Feedback on index questions, indicators, or methodology',
		description:
			'Choose this option if your feedback concerns how the index is designed, measured, or calculated rather than the score of a particular country.',
		criteriaLabel: 'This includes feedback on:',
		criteria: [
			'An index question or assessment criterion.',
			'A specific indicator within a dimension.',
			'Whether an indicator is relevant to the scope of its dimension.',
			'Whether a question or indicator is applicable across different countries.',
			'Whether an assessment criterion is realistic or practical to apply.',
			'The methodology or calculation used to determine scores.'
		],
		whatHappensNext:
			'Your feedback will be shared with the AAPO Leading Committee, which is responsible for overseeing and improving the index. The committee will review the feedback and may discuss, propose, or revise the questions, indicators, or methodology to ensure that the index remains relevant, practical, and reflective of conditions across different country contexts.'
	},
	{
		title: 'Feedback on the website and user experience',
		description:
			'Choose this option if you encounter an issue with the website or have suggestions for making it easier and more intuitive to use.',
		criteriaLabel: 'This includes feedback about:',
		criteria: [
			'Website functionality or technical issues.',
			'Problems with displaying data, scores, charts, or other content.',
			'Incorrect or unclear text displayed on the website.',
			'Website behaviour or responsiveness.',
			'Suggestions for improving the overall user experience.'
		],
		whatHappensNext:
			'Your feedback will be sent to the website development team for review. The team will investigate the issue and, where appropriate, make improvements to provide a more accessible, intuitive, and user-friendly experience.'
	},
	{
		title: 'Other feedback',
		description:
			'Choose this option if your feedback is important but does not clearly fit into any of the categories above.',
		criteriaLabel: 'You can use this category for:',
		criteria: [
			'Issues or concerns that fall outside the other feedback categories.',
			'Suggestions or observations about the index or website that you believe are important to share.',
			'Other matters that may require attention from the AAPO or website teams.'
		],
		whatHappensNext:
			'Your feedback will first be reviewed by the website development team. The team will assess the issue and forward it to the person, team, or committee best placed to address it.'
	}
];
