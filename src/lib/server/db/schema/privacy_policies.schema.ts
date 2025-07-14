import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const PrivacyPoliciesModelName = 'privacy_policies';

export const privacy_policies = pgTable(PrivacyPoliciesModelName, {
	...defaultSchemaFields,
	content: text('content').notNull(),
	version: text('version').notNull(),
	effective_date: timestamp('effective_date').notNull()
});

export type PrivacyPolicies = typeof privacy_policies.$inferSelect;
export type PrivacyPoliciesInsert = typeof privacy_policies.$inferInsert;
