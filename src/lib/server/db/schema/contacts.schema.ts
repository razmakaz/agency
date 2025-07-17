import { check, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { sql } from 'drizzle-orm';
import { phone_numbers } from './phone_numbers.schema';
import { addresses } from './addresses.schema';
import { users } from './auth.schema';

export enum ContactType {
	Staff = 'Staff',
	Partner = 'Partner',
	Client = 'Client',
	Contact = 'Contact',
	Associate = 'Associate',
	Vendor = 'Vendor',
	Other = 'Other'
}

export const ContactsModelName = 'contacts';

export const contacts = pgTable(
	ContactsModelName,
	{
		...defaultSchemaFields,

		// For Staff, Associates, Contacts, and Other
		first_name: text('first_name'),
		middle_name: text('middle_name'),
		last_name: text('last_name'),

		// For Partners, Clients, and Vendors
		legal_name: text('legal_name'),
		preferred_name: text('preferred_name'),

		// This is the name that will be displayed to the user
		// It is the preferred name if it is not empty, otherwise it is the first name
		display_name: text('display_name').generatedAlwaysAs(
			sql`
                CASE 
                    WHEN contact_type IN ('Partner', 'Vendor', 'Client') THEN 
                    COALESCE(NULLIF(trim(preferred_name), ''), trim(legal_name))
                    ELSE 
                    COALESCE(NULLIF(trim(preferred_name), ''), trim(first_name))
                END
                `
		),

		preferred_language: text('preferred_language').notNull().default('en'),

		contact_type: text('contact_type').$type<ContactType>().notNull().default(ContactType.Other),

		accepted_terms_at: timestamp('accepted_terms_on', { mode: 'string' }),
		opt_in_at: timestamp('opt_in_on', { mode: 'string' }),
		last_login_at: timestamp('last_login_at', { mode: 'string' }),

		user_id: text('user_id').references(() => users.id),

		phones: text('phones')
			.references(() => phone_numbers.id)
			.array(),
		emails: text('emails').array(),
		addresses: text('addresses')
			.references(() => addresses.id)
			.array(),
		notes: text('notes').array()
	},
	(t) => [
		index('idx_name').on(t.display_name),
		index('idx_type').on(t.contact_type),
		index('idx_emails').on(t.emails),
		index('idx_phones').on(t.phones)
	]
);

export type Contacts = typeof contacts.$inferSelect;
export type ContactsInsert = typeof contacts.$inferInsert;
