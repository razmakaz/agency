import { pgTable, primaryKey, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { onboarding_steps } from './onboarding_steps.schema';

export const OnboardingEntriesModelName = 'onboarding_entries';

export const onboarding_entries = pgTable(
	OnboardingEntriesModelName,
	{
		...defaultSchemaFields,
		target_id: text('target_id').notNull(),
		step_id: text('step_id')
			.references(() => onboarding_steps.id)
			.notNull(),
		completed_at: timestamp('completed_at', { mode: 'string' })
	},
	(table) => [
		unique('idx_onboardings_entries_step_id_target_id').on(table.step_id, table.target_id)
	]
);

export type OnboardingEntries = typeof onboarding_entries.$inferSelect;
export type OnboardingEntriesInsert = typeof onboarding_entries.$inferInsert;
