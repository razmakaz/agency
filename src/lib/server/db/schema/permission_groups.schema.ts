import { index, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const PermissionGroupsModelName = 'permission_groups';

export const permission_groups = pgTable(
	PermissionGroupsModelName,
	{
		...defaultSchemaFields,
		name: text('name').notNull(),
		permissions: text('permissions').array().default([]),
		order: integer('order').notNull().default(0)
	},
	(table) => [index('idx_permission_groups_name').on(table.name)]
);

export type PermissionGroups = typeof permission_groups.$inferSelect;
export type PermissionGroupsInsert = typeof permission_groups.$inferInsert;
