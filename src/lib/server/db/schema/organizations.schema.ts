import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { addresses } from './addresses.schema';
import { eq, sql } from 'drizzle-orm';
import { db } from '..';

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

export const organizations_repo = {
	// Creators
	create: async (org: OrganizationsInsert): Promise<Organizations> => {
		const newOrg = await db.insert(organizations).values(org).returning();
		await organizations_repo.cascadeAncestry(newOrg[0].id);
		return newOrg[0] as Organizations;
	},
	update: async (org: Organizations): Promise<Organizations> => {
		const updatedOrg = await db
			.update(organizations)
			.set(org)
			.where(eq(organizations.id, org.id))
			.returning();

		// Update the ancestry for the org and all descendants
		await organizations_repo.cascadeAncestry(org.id);
		return updatedOrg[0] as Organizations;
	},
	// Deleters
	// Soft delete and cascade ancestry
	softDelete: async (id: string): Promise<Organizations> => {
		const updatedOrg = await db
			.update(organizations)
			.set({ is_deleted: true })
			.where(eq(organizations.id, id))
			.returning();
		await organizations_repo.cascadeAncestry(id);
		return updatedOrg[0] as Organizations;
	},
	// Hard delete and cascade ancestry
	hardDelete: async (id: string): Promise<Organizations> => {
		const deletedOrg = await db.delete(organizations).where(eq(organizations.id, id)).returning();
		await organizations_repo.cascadeAncestry(id);
		return deletedOrg[0] as Organizations;
	},
	// Utilities
	cascadeAncestry: async (orgId: string): Promise<void> => {
		// Get the org to update, ignoring soft-deleted entries
		const org = await db
			.select()
			.from(organizations)
			.where(
				sql`${organizations.id} = ${orgId} AND (${organizations.is_deleted} IS NULL OR ${organizations.is_deleted} = false)`
			)
			.then((res) => res[0]);
		if (!org) return;

		// Compute new ancestry: parent's ancestry + '/' + this org's id
		let newAncestry = '/';
		if (org.parent_id) {
			const parent = await db
				.select()
				.from(organizations)
				.where(
					sql`${organizations.id} = ${org.parent_id} AND (${organizations.is_deleted} IS NULL OR ${organizations.is_deleted} = false)`
				)
				.then((res) => res[0]);
			newAncestry = (parent?.ancestry ?? '/') + org.id + '/';
		} else {
			newAncestry = '/' + org.id + '/';
		}

		const oldAncestry = org.ancestry;

		// Update this org's ancestry
		await db
			.update(organizations)
			.set({ ancestry: newAncestry })
			.where(eq(organizations.id, orgId));

		// Update all descendants' ancestry, ignoring soft-deleted entries
		const descendants = await db
			.select()
			.from(organizations)
			.where(
				sql`${organizations.ancestry} LIKE ${oldAncestry + '%'} AND (${organizations.is_deleted} IS NULL OR ${organizations.is_deleted} = false)`
			);

		for (const descendant of descendants) {
			// Replace only the prefix (oldAncestry) with newAncestry
			const updatedAncestry = descendant.ancestry.replace(oldAncestry, newAncestry);
			await db
				.update(organizations)
				.set({ ancestry: updatedAncestry })
				.where(eq(organizations.id, descendant.id));
		}
	}
};
