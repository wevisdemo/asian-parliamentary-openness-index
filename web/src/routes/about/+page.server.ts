import { dimensions, type Dimension } from '$lib/constants/dimensions';
import { indicators } from '$lib/data/indicators';
import { respondents, type Respondent } from '$lib/data/respondents';
import type { PageServerLoad } from './$types';

const getOrganizationName = ({ organization, names }: Respondent) =>
	organization ?? names?.join(', ') ?? '';

const indicatorCountByDimension = Object.fromEntries(
	dimensions.map((dimension) => [
		dimension,
		indicators.filter((indicator) => indicator.dimension === dimension).length
	])
) as Record<Dimension, number>;

export const load: PageServerLoad = () => ({
	indicatorCount: indicators.length,
	indicatorCountByDimension,
	respondents: respondents.toSorted(
		(a, b) =>
			a.country.localeCompare(b.country) ||
			getOrganizationName(a).localeCompare(getOrganizationName(b))
	)
});
