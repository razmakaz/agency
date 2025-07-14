import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { addresses } from './addresses.schema';

export const OrganizationsModelName = 'organizations';

export const organizations = pgTable(
	OrganizationsModelName,
	{
		...defaultSchemaFields,
		display_name: text('display_name'),
		legal_name: text('legal_name'),
		ein: text('ein'),
		addresses: text('addresses')
			.references(() => addresses.id)
			.array(),
		parent_id: text('parent_id').references(() => organizations.id),
		ancestry: text('ancestry').notNull().default('/')
	},
	(table) => [
		index('idx_organizations_parent_id').on(table.parent_id),
		index('idx_organizations_ancestry').on(table.ancestry)
	]
);

export type Organizations = typeof organizations.$inferSelect;
export type OrganizationsInsert = typeof organizations.$inferInsert;
