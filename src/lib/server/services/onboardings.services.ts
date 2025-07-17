import { db } from '$lib/server/db';
import {
	onboarding_steps,
	OnboardingStepTargetType,
	type OnboardingStepsInsert
} from '$lib/server/db/schema/onboarding_steps.schema';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { onboarding_entries, type OnboardingEntriesInsert } from '../db/schema/';

export const OnboardingServices = {
	/**
	 * Create onboarding entries for a target
	 * @param target_type - The type of target
	 * @param target_id - The id of the target
	 * @returns The onboarding entries
	 */
	createOnboardingEntries: async ({
		target_type,
		target_id
	}: {
		target_type: OnboardingStepTargetType;
		target_id: string;
	}) => {
		// Get the steps for the target type
		const steps = await db
			.select()
			.from(onboarding_steps)
			.where(eq(onboarding_steps.target_type, target_type));

		// Generate the entries for the target
		const entries = OnboardingServices.onboardingEntryFactory({ target_id, steps });

		// If there are no steps, return an empty array
		if (entries.length === 0) {
			return [];
		}

		// Insert the entries into the database
		// If the entry already exists, do nothing
		await db.insert(onboarding_entries).values(entries).onConflictDoNothing();
		return entries;
	},

	/**
	 * Get the incomplete onboarding entries for a target
	 * @param target_type - The type of target
	 * @param target_id - The id of the target
	 * @returns The incomplete onboarding entries
	 */
	getIncompleteOnboardingEntries: async (
		target_type: OnboardingStepTargetType,
		target_id: string
	) => {
		// Create the onboarding entries if they don't exist
		await OnboardingServices.createOnboardingEntries({
			target_type,
			target_id
		});

		// Get the complete list of incomplete onboarding entries
		const steps = await db
			.select({
				name: onboarding_steps.step_name,
				order: onboarding_steps.step_order,
				skippable: onboarding_steps.skippable,
				target_type: onboarding_steps.target_type,
				target_id: onboarding_entries.target_id,
				completed_at: onboarding_entries.completed_at
			})
			.from(onboarding_entries)
			.innerJoin(onboarding_steps, eq(onboarding_entries.step_id, onboarding_steps.id))
			.where(
				and(
					eq(onboarding_entries.target_id, target_id),
					isNull(onboarding_entries.completed_at),
					eq(onboarding_steps.target_type, target_type)
				)
			)
			.orderBy(asc(onboarding_steps.step_order));

		// Return the incomplete onboarding entries
		return steps || [];
	},
	/**
	 * Check if a user has incomplete onboarding entries
	 * @param user_id - The id of the user
	 * @returns True if the user has incomplete onboarding entries, false otherwise
	 */
	userHasIncompleteOnboardingEntries: async (user_id: string) => {
		const incompleteEntries = await OnboardingServices.getIncompleteOnboardingEntries(
			OnboardingStepTargetType.USER,
			user_id
		);
		return incompleteEntries.length > 0;
	},
	/**
	 * Generate the onboarding entries for a target
	 * @param target_id - The id of the target
	 * @param steps - The steps to generate the entries for
	 * @returns The onboarding entries
	 */
	onboardingEntryFactory: ({
		target_id,
		steps
	}: {
		target_id: string;
		steps: OnboardingStepsInsert[];
	}) => {
		// Generate the entries for the target
		return steps.map((step) => {
			return {
				target_id: target_id,
				step_id: step.id,
				completed_at: null
			} as OnboardingEntriesInsert;
		});
	}
};
