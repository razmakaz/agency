import { defaultSchemaFields } from '../default.schema';
import { pgTable, text } from 'drizzle-orm/pg-core';

export enum CommTemplateType {
	EMAIL = 'EMAIL',
	SMS = 'SMS'
}

export const CommTemplateModelName = 'comm_template';

export const comm_templates = pgTable(CommTemplateModelName, {
	...defaultSchemaFields,
	name: text('name').notNull(),
	type: text('type').$type<CommTemplateType>().notNull(),
	from: text('from'),
	reply_to: text('reply_to')
});

export type CommTemplates = typeof comm_templates.$inferSelect;
export type CommTemplatesInsert = typeof comm_templates.$inferInsert;
