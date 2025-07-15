import { db } from '$lib/server/db';
import Ecco from '$lib/shared/utils/Ecco';
import { organizations } from '../schema/organizations.schema';

export const seed_organizations = async () => {
	const orgs = await db
		.insert(organizations)
		.values([
			{
				display_name: 'Agency',
				legal_name: 'Agency, LLC',
				ein: '12-3456789'
			}
		])
		.returning();

	orgs.forEach((org) => {
		Ecco.info('organizations', `Seeded organization ${org.display_name} (${org.id})`);
	});
};
