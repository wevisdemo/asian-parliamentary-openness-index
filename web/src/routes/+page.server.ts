import { respondents } from '$lib/data/respondents';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	teamLogos: [
		...new Map(
			respondents.flatMap(({ organization, organizationLogo }) =>
				organization && organizationLogo ? [[organization, organizationLogo] as const] : []
			)
		)
	].map(([organization, logo]) => ({ organization, logo }))
});
