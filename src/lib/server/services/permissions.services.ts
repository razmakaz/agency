import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { permissions } from '../db/schema/permissions.schema';

export const PermissionsServices = {
	/**
	 * This function checks if a user has a permission matching the given criteria.
	 * It builds a query that always requires the user_id to match.
	 * If 'role', 'resource', or 'context' are provided, it adds those as additional filters.
	 * If any of those are omitted (undefined), their filter is not included in the query.
	 *
	 * For example:
	 * - If only userId and resource are provided, it will match any permission for that user and resource, regardless of role or context.
	 * - If only userId is provided, it will match any permission for that user, regardless of role, resource, or context.
	 * - If all are provided, it will match only if all fields match.
	 *
	 * If a user is requesting a resource but doesn't require a specific role or context,
	 * this will still find the user as long as there is a permission for that user and resource,
	 * regardless of the role or context values.
	 * @param userId
	 * @param role
	 * @param resource
	 * @param context
	 * @returns true if the user has the permission, false otherwise
	 */
	hasPermission: async (
		userId: string,
		{
			role,
			resource,
			context
		}: {
			role?: string;
			resource?: string;
			context?: string;
		}
	) => {
		const user = await db
			.select()
			.from(permissions)
			.where(
				and(
					eq(permissions.user_id, userId),
					role ? eq(permissions.role, role) : undefined,
					resource ? eq(permissions.resource, resource) : undefined,
					context ? eq(permissions.context, context) : undefined
				)
			)
			.then((res) => res[0]);
		return user !== undefined;
	}
};
