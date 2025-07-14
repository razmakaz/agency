import { ResendMailer } from './Resend';
import { MailGunMailer } from './MailGun';
import { SendGridMailer } from './SendGrid';
import type { TMailerFn, TMailerOptions } from '$lib/@types/Mailer';
import { db } from '$lib/server/db';
import { comm_template_entries } from '$lib/server/db/schema/comm_template_entries.schema';
import { comm_templates } from '../../db/schema/comm_templates.schema';
import { and, eq } from 'drizzle-orm';
import Ecco from '$lib/shared/utils/Ecco';

export const createMailer = (strategy: TMailerOptions['strategy']): TMailerFn => {
	switch (strategy) {
		case 'sendgrid':
			return SendGridMailer;
		case 'mailgun':
			return MailGunMailer;
		case 'resend':
			return ResendMailer;
	}
};

export const mailerUtils = {
	getTemplate: async ({
		templateName,
		language,
		variables
	}: {
		templateName: string;
		language: string;
		variables: Record<string, string>;
	}) => {
		const template = await db
			.select()
			.from(comm_template_entries)
			.innerJoin(comm_templates, eq(comm_template_entries.comm_template_id, comm_templates.id))
			.where(
				and(eq(comm_templates.name, templateName), eq(comm_template_entries.language, language))
			);
		if (template.length === 0) {
			Ecco.error('mailer', `Template ${templateName} not found`);
			return null;
		}

		return template[0].comm_template_entries.body.replace(
			/{{(.*?)}}/g,
			(match, p1) => variables[p1] || match
		);
	},
	recordEmail: async ({
		email,
		subject,
		body,
		variables
	}: {
		email: string;
		subject: string;
		body: string;
		variables: Record<string, string>;
	}) => {
		Ecco.info('mailer', `Recording email to ${email}`);
		Ecco.info('mailer', `Subject: ${subject}`);
		Ecco.info('mailer', `Body: ${body}`);
		Ecco.info('mailer', `Variables: ${JSON.stringify(variables)}`);
	}
};
