import { defaultSchemaFields } from '../default.schema';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const AddressTypeOptions = {
	RESIDENTIAL: {
		name: 'Residential'
	},
	BUSINESS: {
		name: 'Business'
	},
	MAILING: {
		name: 'Mailing'
	},
	WORKSITE: {
		name: 'Worksite'
	},
	OTHER: {
		name: 'Other'
	}
};
export type AddressType = keyof typeof AddressTypeOptions;

export const AddressesModelName = 'addresses';

export const addresses = pgTable(AddressesModelName, {
	...defaultSchemaFields,
	address_line_1: text('address_line_1'),
	address_line_2: text('address_line_2'),
	address_line_3: text('address_line_3'),
	locality: text('locality'), // City/Town/Village
	region: text('region'), // State/Province/Region
	postal_code: text('postal_code'), // Universal postal code field
	country_code: text('country_code'), // ISO 3166-1 alpha-2 country code
	country_name: text('country_name'),
	address_type: text('address_type').$type<AddressType>().notNull(),
	latitude: text('latitude'),
	longitude: text('longitude')
});

export type Addresses = typeof addresses.$inferSelect;
export type AddressesInsert = typeof addresses.$inferInsert;
