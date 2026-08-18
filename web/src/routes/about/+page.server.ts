import { respondents } from '$lib/data/respondents';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ respondents });
