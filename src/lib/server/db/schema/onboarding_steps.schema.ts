import { boolean, integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export enum OnboardingStepTargetType {
	ORGANIZATION = 'organization',
	USER = 'user',
	ASSOCIATE = 'associate'
}

export const OnboardingStepsModelName = 'onboarding_steps';

export const onboarding_steps = pgTable(
	OnboardingStepsModelName,
	{
		...defaultSchemaFields,
		step_name: text('step_name').notNull(),
		step_order: integer('step_order').notNull(),
		description: text('description'),
		skippable: boolean('skippable').default(false),
		target_type: text('target_type').$type<OnboardingStepTargetType>().notNull(),
		effective_date: timestamp('effective_date').notNull()
	},
	(table) => [
		unique('idx_onboardings_organizations_step_name').on(table.step_name, table.target_type)
	]
);

export type OnboardingSteps = typeof onboarding_steps.$inferSelect;
export type OnboardingStepsInsert = typeof onboarding_steps.$inferInsert;
