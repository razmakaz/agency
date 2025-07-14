import { integer, pgTable, text, unique } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { journals } from './journals.schema';

export const JournalEntryTypeOptions = {
	DEBIT: {
		name: 'Debit',
		icon: 'dollar-sign'
	},
	CREDIT: {
		name: 'Credit',
		icon: 'dollar-sign'
	}
};

export type JournalEntryType = keyof typeof JournalEntryTypeOptions;

export const JournalEntriesModelName = 'journal_entries';

export const journal_entries = pgTable(
	JournalEntriesModelName,
	{
		...defaultSchemaFields,
		journal_id: text('journal_id')
			.references(() => journals.id)
			.notNull(),
		entry_type: text('entry_type').$type<JournalEntryType>().notNull(),
		amount: integer('amount').notNull(),

		description: text('description').notNull(),

		entity_id: text('entity_id').notNull(),
		entity_type: text('entity_type').notNull(),
		entity_reference: text('entity_reference').notNull()
	},
	(table) => [
		unique('idx_idempotency_key').on(
			table.journal_id,
			table.entry_type,
			table.entity_type,
			table.entity_id,
			table.entity_reference
		)
	]
);

export type JournalEntries = typeof journal_entries.$inferSelect;
export type JournalEntriesInsert = typeof journal_entries.$inferInsert;
