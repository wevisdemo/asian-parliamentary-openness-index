import { respondents, type Respondent } from '$lib/data/respondents';
import type { PageServerLoad } from './$types';

const getOrganizationName = ({ organization, names }: Respondent) =>
	organization ?? names?.join(', ') ?? '';

export const load: PageServerLoad = () => ({
	respondents: respondents.toSorted(
		(a, b) =>
			a.country.localeCompare(b.country) ||
			getOrganizationName(a).localeCompare(getOrganizationName(b))
	)
});
