import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { comm_templates } from './comm_templates.schema';

export const CommItemProviderOptions = {
	RESEND: {
		name: 'Resend'
	},
	MAILGUN: {
		name: 'Mailgun'
	},
	SENDGRID: {
		name: 'SendGrid'
	}
};

export type CommItemProviderKey =
	(typeof CommItemProviderOptions)[keyof typeof CommItemProviderOptions];

export const CommItemModelName = 'comm_items';

export const comm_items = pgTable(CommItemModelName, {
	...defaultSchemaFields,
	comm_template_id: text('comm_template_id').references(() => comm_templates.id),
	provider_id: text('provider_id'),
	provider: text('provider')
		.$type<CommItemProviderKey>()
		.default(CommItemProviderOptions.RESEND)
		.notNull(),
	from: text('from').notNull(),
	to: text('to').notNull(),
	cc: text('cc').array().default([]),
	bcc: text('bcc').array().default([]),
	reply_to: text('reply_to').array().default([]),
	subject: text('subject').notNull(),
	html: text('html'),
	text: text('text')
});

export type CommItems = typeof comm_items.$inferSelect;
export type CommItemsInsert = typeof comm_items.$inferInsert;
