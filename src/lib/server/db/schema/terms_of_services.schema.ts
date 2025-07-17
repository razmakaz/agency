import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const TermsOfServicesModelName = 'terms_of_services';

export const terms_of_services = pgTable(TermsOfServicesModelName, {
	...defaultSchemaFields,
	content: text('content').notNull(),
	version: text('version').notNull(),
	effective_date: timestamp('effective_date', { mode: 'string' }).notNull()
});

export type TermsOfServices = typeof terms_of_services.$inferSelect;
export type TermsOfServicesInsert = typeof terms_of_services.$inferInsert;
