import { OnboardingStepTargetType } from '$lib/server/db/schema/onboarding_steps.schema';
import { Services } from '$lib/server/services/Servicer';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const incompleteEntries = await Services.onboardings.getIncompleteOnboardingEntries(
		OnboardingStepTargetType.USER,
		locals.user?.id ?? ''
	);

	if (incompleteEntries.length === 0) {
		throw redirect(302, '/');
	}

	return {
		incompleteEntries
	};
};
