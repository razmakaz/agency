import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { journals } from './journals.schema';

export const JournalBalancesModelName = 'journal_balances';

export const journal_balances = pgTable(JournalBalancesModelName, {
	...defaultSchemaFields,
	journal_id: text('journal_id')
		.references(() => journals.id)
		.unique()
		.notNull(),
	balance: integer('balance').notNull()
});

export type JournalBalances = typeof journal_balances.$inferSelect;
export type JournalBalancesInsert = typeof journal_balances.$inferInsert;
