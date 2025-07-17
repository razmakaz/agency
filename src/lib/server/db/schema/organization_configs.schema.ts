import { boolean, integer, pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { uploaded_documents } from './uploaded_documents.schema';
import { organizations } from './organizations.schema';

export const OrganizationConfigsModelName = 'organization_configs';

export const organization_configs = pgTable(OrganizationConfigsModelName, {
	...defaultSchemaFields,

	effective_date: timestamp('effective_date', { mode: 'string' }).notNull(),
	organization_id: text('organization_id')
		.references(() => organizations.id)
		.notNull(),
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
