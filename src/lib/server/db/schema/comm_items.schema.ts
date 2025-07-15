import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { comm_templates } from './comm_templates.schema';

export enum CommItemProvider {
	RESEND = 'Resend',
	MAILGUN = 'Mailgun',
	SENDGRID = 'SendGrid'
}

export const CommItemModelName = 'comm_items';

export const comm_items = pgTable(CommItemModelName, {
	...defaultSchemaFields,
	comm_template_id: text('comm_template_id').references(() => comm_templates.id),
	provider: text('provider').$type<CommItemProvider>().default(CommItemProvider.RESEND).notNull(),
	from: text('from').notNull(),
	to: text('to').notNull(),
	cc: text('cc').array().default([]),
	bcc: text('bcc').array().default([]),
	reply_to: text('reply_to').notNull(),
	subject: text('subject').notNull(),
	html: text('html'),
	text: text('text')
});

export type CommItems = typeof comm_items.$inferSelect;
export type CommItemsInsert = typeof comm_items.$inferInsert;
