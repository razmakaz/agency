import { db } from '..';
import {
	onboarding_steps,
	OnboardingStepTargetType,
	type OnboardingStepsInsert
} from '../schema/onboarding_steps.schema';

export const seed_onboarding_steps = async () => {
	const user_onboarding_steps: OnboardingStepsInsert[] = [
		// User onboarding steps
		{
			id: '1a670403-741f-4131-aa9f-390b81d9c766',
			step_name: 'welcome',
			step_order: 100,
			description: 'welcome to your account',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date().toISOString()
		},
		{
			id: '775ab30f-789c-4401-b687-ca9f43ee613a',
			step_name: 'type',
			step_order: 200,
			description: 'select the type of account',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date().toISOString()
		},
		{
			id: '7da58a61-0671-48dc-be43-375776b5df67',
			step_name: 'profile',
			step_order: 300,
			description: 'setup the profile',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date().toISOString()
		},
		{
			id: '847f51d7-fbd7-41aa-9e27-7cec4a70673e',
			step_name: 'preferences',
			step_order: 400,
			description: 'setup the preferences',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date().toISOString()
		},
		// Partner onboarding steps
		{
			id: '623a9042-a816-4b40-94d5-09bd87c0bd3e',
			step_name: 'company_info',
			step_order: 1000,
			description: 'setup the company info',
			target_type: OnboardingStepTargetType.PARTNER,
			effective_date: new Date().toISOString()
		},
		{
			id: '623a9042-a816-4b40-94d5-09bd87c0bd3e',
			step_name: 'psa',
			step_order: 2000,
			description: 'select the psa',
			target_type: OnboardingStepTargetType.PARTNER,
			effective_date: new Date().toISOString()
		},
		{
			id: 'e4c1fb59-e663-4c57-bdc7-ef6b089ec978',
			step_name: 'w9',
			step_order: 3000,
			description: 'sign the w9',
			target_type: OnboardingStepTargetType.PARTNER,
			effective_date: new Date().toISOString()
		},
		// Client onboarding steps
		{
			id: 'e4c1fb59-e663-4c57-bdc7-ef6b089ec978',
			step_name: 'company_access_request',
			step_order: 1000,
			description: 'request company access',
			target_type: OnboardingStepTargetType.CLIENT,
			effective_date: new Date().toISOString()
		},
		// Client onboarding steps
		{
			id: 'e4c1fb59-e663-4c57-bdc7-ef6b089ec978',
			step_name: 'associate_access_request',
			step_order: 1000,
			description: 'request associate access',
			target_type: OnboardingStepTargetType.ASSOCIATE,
			effective_date: new Date().toISOString()
		}
	];

	const organization_onboarding_steps: OnboardingStepsInsert[] = [
		// Organization onboarding steps
		{
			id: '7da58a61-0671-48dc-be43-375776b5df67',
			step_name: 'preferences',
			step_order: 1,
			description: 'setup the preferences',
			target_type: OnboardingStepTargetType.ORGANIZATION,
			effective_date: new Date().toISOString()
		}
	];

	const onboarding_steps_payload: OnboardingStepsInsert[] = [
		...user_onboarding_steps,
		...organization_onboarding_steps
	];

	for await (const step of onboarding_steps_payload) {
		try {
			await db
				.insert(onboarding_steps)
				.values(step)
				.onConflictDoUpdate({
					target: onboarding_steps.id,
					set: {
						...step
					}
				});
			console.log(`Seeded onboarding step ${step.step_name} (${step.id})`);
		} catch (error: unknown) {
			console.error(
				`Error seeding onboarding step ${step.step_name} (${step.id}):`,
				error instanceof Error ? error.message : String(error)
			);
		}
	}
};
