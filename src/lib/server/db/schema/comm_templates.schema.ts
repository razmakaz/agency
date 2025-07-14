import { defaultSchemaFields } from '../default.schema';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const CommTemplateOptions = {
	EMAIL: {
		name: 'EMAIL',
		label: 'Email'
	},
	SMS: {
		name: 'SMS',
		label: 'SMS'
	}
};

export type CommTemplateType = keyof typeof CommTemplateOptions;

export const CommTemplateModelName = 'comm_template';

export const comm_templates = pgTable(CommTemplateModelName, {
	...defaultSchemaFields,
	name: text('name').notNull(),
	type: text('type').$type<CommTemplateType>().notNull()
});

export type CommTemplates = typeof comm_templates.$inferSelect;
export type CommTemplatesInsert = typeof comm_templates.$inferInsert;
