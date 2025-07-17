import { db } from '$lib/server/db';
import {
	comm_template_entries,
	type CommTemplateEntries
} from '../schema/comm_template_entries.schema';

export const seed_comm_template_entries = async () => {
	const payload = [
		{
			id: 'fe8430bf-239f-499f-897f-2868a7efa7b5',
			comm_template_id: 'c1c7f8c0-ba8a-40e7-a03c-ebcfb045fbd7',
			language: 'en',
			effective_from: new Date().toISOString(),
			subject: 'Your One-Time Password (OTP)',
			body: 'Your OTP is {{otp}}'
		},
		{
			id: '38b291c5-7e5c-45d8-8bb6-5744bb9947c7',
			comm_template_id: 'c1c7f8c0-ba8a-40e7-a03c-ebcfb045fbd7',
			language: 'es',
			effective_from: new Date().toISOString(),
			subject: 'Su contraseña de un solo uso (OTP)',
			body: 'Su OTP es {{otp}}'
		}
	];
	const entries: CommTemplateEntries[] = [];
	for await (const entry of payload) {
		try {
			const inserted = await db
				.insert(comm_template_entries)
				.values(entry)
				.onConflictDoUpdate({
					target: comm_template_entries.id,
					set: {
						...entry
					}
				})
				.returning();
			entries.push(...inserted);
		} catch (error: unknown) {
			console.error(
				`Error seeding comm template entry ${entry.id}:`,
				error instanceof Error ? error.message : String(error)
			);
		}
	}

	entries.forEach((entry) => {
		console.log(`Seeded entry ${entry.id} (${entry.language})`);
	});
};
