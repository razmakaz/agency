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
	},
	/**
	 * Get all unique roles
	 * @returns array of unique roles
	 */
	getPermissionKeys: async () => {
		// Return an object containing roles, resources, and contexts, each with the unique values among all permissions
		const keys = await db
			.select({
				role: permissions.role,
				resource: permissions.resource,
				context: permissions.context
			})
			.from(permissions)
			.groupBy(permissions.role, permissions.resource, permissions.context);
		const roles = keys.map((key) => key.role);
		const resources = keys.map((key) => key.resource);
		const contexts = keys.map((key) => key.context);
		return {
			roles,
			resources,
			contexts
		};
	},
	/**
	 * Create a permission object
	 * @param userId
	 * @param organizationId
	 * @param permission - format: role:resource:context
	 * @returns permission object or null if the permission is invalid
	 */
	permissionFactory: ({
		userId,
		organizationId,
		permission
	}: {
		userId: string;
		organizationId: string;
		permission: string;
	}) => {
		// Make sure the permission is a string
		if (!permission) return null;
		// Make sure the permission has 2 ":"s
		if (permission.split(':').length !== 2) return null;

		// Make sure the permission has 2 ":"s
		const [role, resource, context] = permission.split(':');
		if (!role || !resource || !context) return null;

		// Make sure the role, resource, and context are strings
		return {
			userId,
			organizationId,
			role,
			resource,
			context
		};
	}
};
