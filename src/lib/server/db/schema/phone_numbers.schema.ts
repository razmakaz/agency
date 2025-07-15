import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export enum PhoneNumberType {
	MOBILE = 'MOBILE',
	HOME = 'HOME',
	WORK = 'WORK',
	OTHER = 'OTHER'
}

export const PhoneNumbersModelName = 'phone_numbers';

export const phone_numbers = pgTable(PhoneNumbersModelName, {
	...defaultSchemaFields,
	number: text('number'),
	phone_type: text('phone_type').$type<PhoneNumberType>().default(PhoneNumberType.MOBILE),
	is_primary: boolean('is_primary').default(false)
});

export type PhoneNumbers = typeof phone_numbers.$inferSelect;
export type PhoneNumbersInsert = typeof phone_numbers.$inferInsert;
