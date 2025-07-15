import { db } from '$lib/server/db';
import Ecco from '$lib/shared/utils/Ecco';
import { privacy_policies } from '../schema/privacy_policies.schema';

export const seed_privacy_policies = async () => {
	const policies = await db
		.insert(privacy_policies)
		.values([
			{
				content: 'Privacy Policy',
				effective_date: new Date(),
				version: '0.0.1'
			}
		])
		.returning();

	policies.forEach((policy) => {
		Ecco.info('privacy_policies', `Seeded policy ${policy.version} (${policy.id})`);
	});
};
