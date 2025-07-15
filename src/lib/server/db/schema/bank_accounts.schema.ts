import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export enum BankAccountType {
	CHECKING = 'CHECKING',
	SAVINGS = 'SAVINGS'
}

export const BankAccountsModelName = 'bank_accounts';

export const bank_accounts = pgTable(BankAccountsModelName, {
	...defaultSchemaFields,
	account_name: text('account_name').notNull(),
	account_number: text('account_number').notNull(),
	routing_number: text('routing_number').notNull(),
	account_type: text('account_type').$type<BankAccountType>().notNull(),
	bank_name: text('bank_name').default(''),
	swift: text('swift').default(''), // ISO 9362 (SWIFT/BIC)
	iban: text('iban').default('') // ISO 13616 (IBAN)
});

export type BankAccounts = typeof bank_accounts.$inferSelect;
export type BankAccountsInsert = typeof bank_accounts.$inferInsert;
