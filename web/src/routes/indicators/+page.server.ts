import { indicatorSummariesByChamber } from '$lib/data/indicators';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ indicatorSummariesByChamber });
