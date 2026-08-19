import { indicatorSummaries, sortByAchieved } from '$lib/data/indicators';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	indicatorSummaries: sortByAchieved(indicatorSummaries)
});
