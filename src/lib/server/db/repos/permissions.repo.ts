import { and, eq } from 'drizzle-orm';
import { permissions } from '../schema';
import { db } from '..';

export const permissionGroupsRepo = {
	findAll: async () => {
		return await db.select().from(permissions);
	},
	findBy: async ({
		userId,
		organizationId,
		role,
		resource,
		context
	}: {
		userId?: string;
		organizationId?: string;
		role?: string;
		resource?: string;
		context?: string;
	}) => {
		return await db
			.select()
			.from(permissions)
			.where(
				and(
					userId ? eq(permissions.user_id, userId) : undefined,
					organizationId ? eq(permissions.organization_id, organizationId) : undefined,
					role ? eq(permissions.role, role) : undefined,
					resource ? eq(permissions.resource, resource) : undefined,
					context ? eq(permissions.context, context) : undefined
				)
			);
	}
};
