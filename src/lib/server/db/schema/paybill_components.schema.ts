import { numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { assignments } from './assignments.schema';

export enum PayBillComponentType {
	WAGE = 'WAGE',
	SALARY = 'SALARY',
	STIPEND = 'STIPEND',
	BONUS = 'BONUS',
	EXPENSE = 'EXPENSE'
}

export const PayBillComponentsModelName = 'paybill_components';

export const paybill_components = pgTable(PayBillComponentsModelName, {
	...defaultSchemaFields,

	assignment_id: text('assignment_id')
		.references(() => assignments.id)
		.notNull(),

	pay_rate: numeric('pay_rate').notNull(),
	bill_rate: numeric('bill_rate').notNull()
});

export type PayBillComponents = typeof paybill_components.$inferSelect;
export type PayBillComponentsInsert = typeof paybill_components.$inferInsert;
