import { db } from '$lib/server/db';
import {
	comm_templates,
	CommTemplateType,
	type CommTemplates
} from '../schema/comm_templates.schema';

export const seed_comm_templates = async () => {
	const payload = [
		{
			id: 'c1c7f8c0-ba8a-40e7-a03c-ebcfb045fbd7',
			name: 'otp-verification',
			type: CommTemplateType.EMAIL,
			from: 'no-reply@floc.dev',
			reply_to: 'no-reply@floc.dev'
		}
	];
	const templates: CommTemplates[] = [];
	for await (const template of payload) {
		try {
			const inserted = await db.insert(comm_templates).values(template).returning();
			templates.push(...inserted);
		} catch (err) {
			console.error('Error seeding comm templates:', err);
		}
	}

	templates.forEach((template) => {
		console.log(`Seeded template ${template.name} (${template.id})`);
	});
};
