import { db } from '$lib/server/db';
import Ecco from '$lib/shared/utils/Ecco';
import { comm_template_entries } from '../schema/comm_template_entries.schema';

export const seed_comm_template_entries = async () => {
	const entries = await db
		.insert(comm_template_entries)
		.values([
			{
				comm_template_id: 'c1c7f8c0-ba8a-40e7-a03c-ebcfb045fbd7',
				language: 'en',
				effective_from: new Date(),
				subject: 'Your One-Time Password (OTP)',
				body: 'Your OTP is {{otp}}'
			},
			{
				comm_template_id: 'c1c7f8c0-ba8a-40e7-a03c-ebcfb045fbd7',
				language: 'es',
				effective_from: new Date(),
				subject: 'Su contraseña de un solo uso (OTP)',
				body: 'Su OTP es {{otp}}'
			}
		])
		.returning();

	entries.forEach((entry) => {
		Ecco.info('comm_template_entries', `Seeded entry ${entry.id} (${entry.language})`);
	});
};
