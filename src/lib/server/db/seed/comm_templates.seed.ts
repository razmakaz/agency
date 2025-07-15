import { db } from '$lib/server/db';
import Ecco from '$lib/shared/utils/Ecco';
import { comm_templates } from '../schema/comm_templates.schema';

export const seed_comm_templates = async () => {
	const templates = await db
		.insert(comm_templates)
		.values([
			{
				id: 'c1c7f8c0-ba8a-40e7-a03c-ebcfb045fbd7',
				name: 'otp_email',
				type: 'EMAIL'
			}
		])
		.returning();

	templates.forEach((template) => {
		Ecco.info('comm_templates', `Seeded template ${template.name} (${template.id})`);
	});
};






