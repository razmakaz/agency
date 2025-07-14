import { db } from '$lib/server/db';
import { comm_templates } from '../schema/comm_templates.schema';

export const seed_comm_templates = async () => {
	const templates = await db.select().from(comm_templates);

	if (templates.length > 0) {
		return;
	}

	await db.insert(comm_templates).values([
		{
			name: 'email',
			type: 'EMAIL'
		}
	]);
};
