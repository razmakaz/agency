import { db } from '$lib/server/db';
import { privacy_policies, type PrivacyPolicies } from '../schema/privacy_policies.schema';

export const seed_privacy_policies = async () => {
	const payload = [
		{
			id: '9a7b146b-ce6d-4bdf-a712-8074fff1b6cf',
			content: 'Privacy Policy',
			effective_date: new Date(),
			version: '0.0.1'
		}
	];
	const policies: PrivacyPolicies[] = [];
	for await (const policy of payload) {
		try {
			const inserted = await db.insert(privacy_policies).values(policy).returning();
			policies.push(...inserted);
		} catch (err) {
			console.error('Error seeding privacy policies:', err);
		}
	}

	policies.forEach((policy) => {
		console.log(`Seeded policy ${policy.version} (${policy.id})`);
	});
};
