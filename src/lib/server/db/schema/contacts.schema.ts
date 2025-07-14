import { check, index, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { sql } from 'drizzle-orm';
import { phone_numbers } from './phone_numbers.schema';
import { addresses } from './addresses.schema';

export const ContactTypeOptions = {
	Staff: {
		name: 'Staff',
		icon: 'user'
	},
	Partner: {
		name: 'Partner',
		icon: 'user'
	},
	Client: {
		name: 'Client',
		icon: 'user'
	},
	Contact: {
		name: 'Contact',
		icon: 'user'
	},
	Associate: {
		name: 'Associate',
		icon: 'user'
	},
	Vendor: {
		name: 'Vendor',
		icon: 'user'
	},
	Other: {
		name: 'Other',
		icon: 'user'
	}
};

export type ContactType = keyof typeof ContactTypeOptions;

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
		display_name: text('display_name')
			.generatedAlwaysAs(
				sql`
                CASE 
                    WHEN contact_type IN ('Partner', 'Vendor', 'Client') THEN 
                    COALESCE(NULLIF(trim(preferred_name), ''), trim(legal_name))
                    ELSE 
                    COALESCE(NULLIF(trim(preferred_name), ''), trim(first_name))
                END
                `
			)
			.notNull(),

		preferred_language: text('preferred_language').notNull().default('en'),

		contact_type: text('contact_type').$type<ContactType>().notNull().default('Other'),

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
		index('idx_phones').on(t.phones),
		check(
			'contact_type_check',
			sql`
                (
                    contact_type IN ('Staff', 'Associate', 'Contact', 'Other') 
                AND first_name IS NOT NULL AND last_name IS NOT NULL AND legal_name IS NULL
                )
                OR (
                    contact_type IN ('Partner', 'Vendor', 'Client') 
                    AND legal_name IS NOT NULL AND first_name IS NULL AND last_name IS NULL
                    )
            `
		)
	]
);

export type Contacts = typeof contacts.$inferSelect;
export type ContactsInsert = typeof contacts.$inferInsert;
