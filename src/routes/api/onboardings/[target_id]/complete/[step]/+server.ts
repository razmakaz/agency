import { OnboardingServices } from '$lib/server/services/onboardings.services';

export const POST = async ({ request, params }) => {
	const body = await request.json();

	const { target_id, step } = params;

	const onboarding_entry = await OnboardingServices.completeOnboardingEntry(target_id, step, body);

	if (!onboarding_entry) {
		return new Response(JSON.stringify({ error: 'Onboarding entry not found' }), {
			status: 404
		});
	}

	return new Response(JSON.stringify(onboarding_entry), { status: 200 });
};
