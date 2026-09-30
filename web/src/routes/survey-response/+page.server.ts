import { getSurveyQuestions } from '$lib/data/survey';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	questions: await getSurveyQuestions()
});
