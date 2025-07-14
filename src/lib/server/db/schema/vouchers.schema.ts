import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export type VoucherType =
	| 'invoice'
	| 'statement'
	| 'debit_memo'
	| 'credit_memo'
	// | 'distribution'
	| 'receipt';

export const VouchersModelName = 'vouchers';

export const vouchers = pgTable(VouchersModelName, {
	...defaultSchemaFields,
	type: text('type').notNull()
});

export type Vouchers = typeof vouchers.$inferSelect;
export type VouchersInsert = typeof vouchers.$inferInsert;
