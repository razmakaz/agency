import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const NotebookEntriesModelName = 'notebook_entries';

export const notebook_entries = pgTable(
	NotebookEntriesModelName,
	{
		...defaultSchemaFields,
		schema_name: text('schema_name').notNull(),
		object_id: text('object_id').notNull(),
		content: text('content').notNull()
	},
	(table) => [index('idx_notebook_entries_object_id').on(table.object_id, table.schema_name)]
);

export type NotebookEntries = typeof notebook_entries.$inferSelect;
export type NotebookEntriesInsert = typeof notebook_entries.$inferInsert;
