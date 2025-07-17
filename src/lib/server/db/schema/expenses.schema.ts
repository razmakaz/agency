import { numeric, pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { assignments } from './assignments.schema';

export const ExpensesModelName = 'expenses';

export const expenses = pgTable(ExpensesModelName, {
	...defaultSchemaFields,
	assignment_id: text('assignment_id').references(() => assignments.id),
	amount: numeric('amount'),
	date: timestamp('date', { mode: 'string' }),
	notes: text('notes').array()
});

export type Expenses = typeof expenses.$inferSelect;
export type ExpensesInsert = typeof expenses.$inferInsert;
