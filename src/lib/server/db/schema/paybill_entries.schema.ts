import { numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { assignments } from './assignments.schema';

export const PayBillEntriesModelName = 'paybill_entries';

export const paybill_entries = pgTable(PayBillEntriesModelName, {
	...defaultSchemaFields,

	assignment_id: text('assignment_id')
		.references(() => assignments.id)
		.notNull(),

	description: text('description').notNull(),

	pay_units: numeric('pay_units').notNull().default('0'),
	pay_amount: numeric('pay_amount').notNull().default('0'),

	bill_units: numeric('bill_units').notNull().default('0'),
	bill_amount: numeric('bill_amount').notNull().default('0')
});

export type PayBillEntries = typeof paybill_entries.$inferSelect;
export type PayBillEntriesInsert = typeof paybill_entries.$inferInsert;
