import { db } from '$lib/server/db';
import Ecco from '$lib/shared/utils/Ecco';
import { terms_of_services } from '../schema/terms_of_services.schema';
import type { TermsOfServices } from '../schema/terms_of_services.schema';

export const seed_terms_of_services = async () => {
	const terms = await db
		.insert(terms_of_services)
		.values([
			{
				content: 'Terms of Service',
				effective_date: new Date(),
				version: '0.0.1'
			}
		])
		.returning();

	terms.forEach((term: TermsOfServices) => {
		Ecco.info('terms_of_service', `Seeded term ${term.version} (${term.id})`);
	});
};
