import { db } from '$lib/server/db';
import { organizations, type Organizations } from '../schema/organizations.schema';

export const seed_organizations = async () => {
	const payload = [
		{
			id: '64d242b9-a8e5-49b4-8534-a9269a6edd3c',
			display_name: 'Agency',
			legal_name: 'Agency, LLC',
			ein: '12-3456789'
		}
	];
	const orgs: Organizations[] = [];
	for await (const org of payload) {
		try {
			const inserted = await db
				.insert(organizations)
				.values(org)
				.onConflictDoUpdate({
					target: organizations.id,
					set: {
						...org
					}
				})
				.returning();
			orgs.push(...inserted);
		} catch (error: unknown) {
			console.error(
				`Error seeding organization ${org.display_name} (${org.id}):`,
				error instanceof Error ? error.message : String(error)
			);
		}
	}

	orgs.forEach((org) => {
		console.log(`Seeded organization ${org.display_name} (${org.id})`);
	});
};
