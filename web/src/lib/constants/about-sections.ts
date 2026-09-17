export const aboutSections = [
	{ id: 'about-the-index', label: 'About the Index' },
	{ id: 'methodology', label: 'Methodology' },
	{ id: 'submit-your-feedback', label: 'Submit Your Feedback' },
	{ id: 'about-contributors', label: 'About Contributors' }
];

export const aboutTheIndexSummary =
	'APOI assesses how openly national parliaments across Asia-Pacific operate, so citizens, media, and reformers can see exactly where each parliament stands. Every parliament is scored against the same set of questions, organized into three equally weighted dimensions of openness: Transparency, Accountability, and Citizen Participation.';

export const getMethodologySummary = (indicatorCount: number, firstCycleYear: number) =>
	`The assessment covers ${indicatorCount} indicators across three dimensions. As each dimension has a different number of indicators and questions, its raw score is converted into a percentage before the three scores are averaged to calculate the overall score, ensuring that each dimension is weighted equally.

The assessment is conducted independently every two years (first launched in ${firstCycleYear}) by local PMOs or think tanks using only publicly available information, with the findings verified by academic experts.`;
