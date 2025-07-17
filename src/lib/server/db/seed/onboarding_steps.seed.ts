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
			effective_date: new Date()
		},
		{
			id: '775ab30f-789c-4401-b687-ca9f43ee613a',
			step_name: 'type',
			step_order: 200,
			description: 'select the type of account',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date()
		},
		{
			id: '7da58a61-0671-48dc-be43-375776b5df67',
			step_name: 'profile',
			step_order: 300,
			description: 'setup the profile',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date()
		},
		{
			id: '847f51d7-fbd7-41aa-9e27-7cec4a70673e',
			step_name: 'preferences',
			step_order: 400,
			description: 'setup the preferences',
			target_type: OnboardingStepTargetType.USER,
			effective_date: new Date()
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
			effective_date: new Date()
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
