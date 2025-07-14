import { numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { assignments } from './assignments.schema';

export const PayBillComponentTypes = {
	WAGE: {
		name: 'Wage'
	},
	SALARY: {
		name: 'Salary'
	},
	STIPEND: {
		name: 'Stipend'
	},
	BONUS: {
		name: 'Bonus'
	},
	EXPENSE: {
		name: 'Expense'
	}
};
export type PayBillComponentType = keyof typeof PayBillComponentTypes;

export const PayBillComponentsModelName = 'pay_bill_components';

export const pay_bill_components = pgTable(PayBillComponentsModelName, {
	...defaultSchemaFields,

	assignment_id: text('assignment_id')
		.references(() => assignments.id)
		.notNull(),

	pay_rate: numeric('pay_rate').notNull(),
	bill_rate: numeric('bill_rate').notNull()
});

export type PayBillComponents = typeof pay_bill_components.$inferSelect;
export type PayBillComponentsInsert = typeof pay_bill_components.$inferInsert;
