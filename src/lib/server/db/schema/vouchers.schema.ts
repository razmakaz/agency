import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export enum VoucherType {
	INVOICE = 'invoice',
	STATEMENT = 'statement',
	DEBIT_MEMO = 'debit_memo',
	Credit_MEMO = 'credit_memo',
	RECEIPT = 'receipt'
}

export const VouchersModelName = 'vouchers';

export const vouchers = pgTable(VouchersModelName, {
	...defaultSchemaFields,
	type: text('type').notNull()
});

export type Vouchers = typeof vouchers.$inferSelect;
export type VouchersInsert = typeof vouchers.$inferInsert;
