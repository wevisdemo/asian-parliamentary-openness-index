/**
 * Format a date parsed from the sheet as `20 August 2026`
 */
export const formatLongDate = (date: Date) =>
	date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
