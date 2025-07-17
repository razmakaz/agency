import { db } from '$lib/server/db';
import { terms_of_services } from '../schema/terms_of_services.schema';
import type { TermsOfServices } from '../schema/terms_of_services.schema';

export const seed_terms_of_services = async () => {
	const payload = [
		{
			id: 'c11bc305-8ec5-44b0-bf6a-62a83cd1b403',
			content: 'Terms of Service',
			effective_date: new Date(),
			version: '0.0.1'
		}
	];
	const terms: TermsOfServices[] = [];
	for await (const term of payload) {
		try {
			const inserted = await db
				.insert(terms_of_services)
				.values(term)
				.onConflictDoUpdate({
					target: terms_of_services.id,
					set: {
						...term
					}
				})
				.returning();
			terms.push(...inserted);
		} catch (error: unknown) {
			console.error(
				`Error seeding terms of services ${term.id}:`,
				error instanceof Error ? error.message : String(error)
			);
		}
	}

	terms.forEach((term: TermsOfServices) => {
		console.log(`Seeded term ${term.version} (${term.id})`);
	});
};
