import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { comm_templates } from './comm_templates.schema';

export const CommTemplateEntriesModelName = 'comm_template_entries';

export const comm_template_entries = pgTable(CommTemplateEntriesModelName, {
	...defaultSchemaFields,
	comm_template_id: text('comm_template_id')
		.references(() => comm_templates.id)
		.notNull(),
	language: text('language').notNull(),
	effective_from: timestamp('effective_from', { mode: 'string' }).notNull(),
	subject: text('subject').notNull(),
	body: text('body').notNull()
});

export type CommTemplateEntries = typeof comm_template_entries.$inferSelect;
export type CommTemplateEntriesInsert = typeof comm_template_entries.$inferInsert;
