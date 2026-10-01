export const aboutSections = [
	{ id: 'about-the-index', label: 'About the Index' },
	{ id: 'methodology', label: 'Methodology' },
	{ id: 'submit-your-feedback', label: 'Submit Your Feedback' },
	{ id: 'about-contributors', label: 'About Contributors' }
];

export const aboutTheIndexSummary =
	'APOI assesses how openly national parliaments across Asia-Pacific operate, so citizens, media, and reformers can see exactly where each parliament stands. Every parliament is scored against the same set of questions, organized into three dimensions of openness: Openness on Information, Openness on Accountability, and Openness on Citizen Participation.';

interface MethodologyCounts {
	indicatorCount: number;
	questionCount: number;
	firstCycleYear: number;
}

export const getMethodologySummary = ({
	indicatorCount,
	questionCount,
	firstCycleYear
}: MethodologyCounts) =>
	`The assessment covers ${indicatorCount} indicators and ${questionCount} questions across three dimensions. Each indicator contains a different number of questions and is worth 1 mark, except for one indicator in the Openness on Information dimension, which is worth 3 marks. As each dimension carries a different number of total marks, they contribute different weights to the overall score.

The assessment is conducted independently every two years (first launched in ${firstCycleYear}) by local PMOs or think tanks using only publicly available information—not what laws or Standing Orders require in principle. Findings are verified by academic experts.`;

export const getMethodologyBrief = ({
	indicatorCount,
	questionCount,
	firstCycleYear
}: MethodologyCounts) =>
	`The assessment covers ${indicatorCount} indicators and ${questionCount} questions across three dimensions. It is conducted independently every two years (first launched in ${firstCycleYear}) by local PMOs or think tanks using only publicly available information—not what laws or Standing Orders require in principle. Findings are verified by academic experts.`;
