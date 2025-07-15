import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export enum JournalType {
	REVENUE = 'REVENUE',
	EXPENSE = 'EXPENSE',
	TRANSFER = 'TRANSFER',
	ADJUSTMENT = 'ADJUSTMENT',
	DISTRIBUTION = 'DISTRIBUTION',
	OTHER = 'OTHER'
}

export const JournalsModelName = 'journals';

export const journals = pgTable(JournalsModelName, {
	...defaultSchemaFields,
	journal_type: text('journal_type').$type<JournalType>().notNull(),
	currency: text('currency').notNull().default('USD'), // ISO 4217 currency code
	description: text('description').default('')
});

export type Journals = typeof journals.$inferSelect;
export type JournalsInsert = typeof journals.$inferInsert;
