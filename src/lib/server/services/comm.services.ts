import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { comm_templates } from '../db/schema/comm_templates.schema';
import { comm_template_entries } from '../db/schema/comm_template_entries.schema';

export const CommServices = {
	findTemplateBy: async ({
		templateName,
		language
	}: {
		templateName: string;
		language: string;
	}) => {
		return await db
			.select()
			.from(comm_template_entries)
			.innerJoin(comm_templates, eq(comm_template_entries.comm_template_id, comm_templates.id))
			.where(
				and(eq(comm_templates.name, templateName), eq(comm_template_entries.language, language))
			);
	}
};
