import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const JournalTypeOptions = {
	REVENUE: {
		name: 'Revenue',
		icon: 'dollar-sign'
	},
	EXPENSE: {
		name: 'Expense',
		icon: 'dollar-sign'
	},
	TRANSFER: {
		name: 'Transfer',
		icon: 'dollar-sign'
	},
	ADJUSTMENT: {
		name: 'Adjustment',
		icon: 'dollar-sign'
	},
	DISTRIBUTION: {
		name: 'Distribution',
		icon: 'dollar-sign'
	},
	OTHER: {
		name: 'Other',
		icon: 'dollar-sign'
	}
};

export type JournalType = keyof typeof JournalTypeOptions;

export const JournalsModelName = 'journals';

export const journals = pgTable(JournalsModelName, {
	...defaultSchemaFields,
	journal_type: text('journal_type').$type<JournalType>().notNull(),
	currency: text('currency').notNull().default('USD'), // ISO 4217 currency code
	description: text('description').default('')
});

export type Journals = typeof journals.$inferSelect;
export type JournalsInsert = typeof journals.$inferInsert;
