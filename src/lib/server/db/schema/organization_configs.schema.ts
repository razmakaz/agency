import { boolean, integer, pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { organizations } from './organization.schema';
import { uploaded_documents } from './uploaded_documents.schema';

export const OrganizationConfigModelName = 'organization_config';

export const organization_configs = pgTable(OrganizationConfigModelName, {
	...defaultSchemaFields,
	organization_id: text('organization_id')
		.references(() => organizations.id)
		.notNull(),
	effective_date: timestamp('effective_date').notNull(),

	// Operation Settings
	distribution_hold: boolean('distribution_hold').default(false),
	chargeback_enabled: boolean('chargeback_enabled').default(true),
	chargeback_grace: integer('chargeback_grace').default(0),

	// Fees & Rates
	late_fee_rate: integer('late_fee_rate').default(0),
	late_fee_grace: integer('late_fee_grace').default(0),

	// Document Settings
	logo_enabled: boolean('use_logo').default(true),
	logo_file: text('logo_file').references(() => uploaded_documents.id)
});

export type OrganizationConfigs = typeof organization_configs.$inferSelect;
export type OrganizationConfigsInsert = typeof organization_configs.$inferInsert;
