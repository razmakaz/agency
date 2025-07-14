import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { organizations } from './organizations.schema';
import { users } from './auth.schema';

export const PermissionsModelName = 'permissions';

export const permissions = pgTable(
	PermissionsModelName,
	{
		...defaultSchemaFields,
		user_id: text('user_id').references(() => users.id),
		organization_id: text('organization_id').references(() => organizations.id),
		role: text('role').notNull(),
		resource: text('resource').notNull(),
		context: text('context').notNull()
	},
	(table) => [
		// index('idx_permissions_set').on(table.user_id, table.organization_id, table.resource),
		index('idx_permissions_role').on(table.role, table.resource, table.context)
	]
);

export type Permissions = typeof permissions.$inferSelect;
export type PermissionsInsert = typeof permissions.$inferInsert;
