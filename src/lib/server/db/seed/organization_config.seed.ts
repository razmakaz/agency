import { db } from '$lib/server/db';
import { organization_configs, type OrganizationConfigs } from '../schema';

export const seed_organization_config = async () => {
	const payload = [
		{
			id: '7df7aa81-e2e1-4a3a-be6f-c24e07a2d873',
            effective_date: new Date(),
            organization_id: '64d242b9-a8e5-49b4-8534-a9269a6edd3c'
		}
	];
	const orgConfigs: OrganizationConfigs[] = [];
	for await (const config of payload) {
		try {
			const inserted = await db.insert(organization_configs).values(config).returning();
			orgConfigs.push(...inserted);
		} catch (err) {
			console.error('Error seeding organizations:', err);
		}
	}

	orgConfigs.forEach((org) => {
		console.log(`Seeded organization config ${org.effective_date} (${org.id})`);
	});
};