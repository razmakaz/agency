import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { organizations } from './organizations.schema';
import { users } from './auth.schema';
import { db } from '..';
import { and, eq } from 'drizzle-orm';

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

export const permissions_repo = {
	create: async (permission: PermissionsInsert): Promise<Permissions> => {
		const perms = await db.insert(permissions).values(permission).returning();
		return perms[0] as Permissions;
	},
	// Finders
	findByUserId: async (userId: string): Promise<Permissions[]> => {
		const perms = await db.select().from(permissions).where(eq(permissions.user_id, userId));
		return perms as Permissions[];
	},
	findByOrganizationId: async (organizationId: string): Promise<Permissions[]> => {
		const perms = await db
			.select()
			.from(permissions)
			.where(eq(permissions.organization_id, organizationId));
		return perms as Permissions[];
	},
	findByUserIdAndOrganizationId: async (
		userId: string,
		organizationId: string
	): Promise<Permissions[]> => {
		const perms = await db
			.select()
			.from(permissions)
			.where(and(eq(permissions.user_id, userId), eq(permissions.organization_id, organizationId)));
		return perms as Permissions[];
	},
	// Updaters
	update: async (permission: Permissions): Promise<Permissions> => {
		const perms = await db
			.update(permissions)
			.set(permission)
			.where(eq(permissions.id, permission.id))
			.returning();
		return perms[0] as Permissions;
	},
	// Deleters
	softDelete: async (permission: Permissions): Promise<Permissions> => {
		const perms = await db
			.update(permissions)
			.set({ is_deleted: true })
			.where(eq(permissions.id, permission.id))
			.returning();
		return perms[0] as Permissions;
	},
	hardDelete: async (permission: Permissions): Promise<Permissions> => {
		const perms = await db.delete(permissions).where(eq(permissions.id, permission.id)).returning();
		return perms[0] as Permissions;
	}
};
