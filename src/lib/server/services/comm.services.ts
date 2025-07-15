import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { comm_templates, type CommTemplates } from '../db/schema/comm_templates.schema';
import { comm_template_entries } from '../db/schema/comm_template_entries.schema';
import Ecco from '$lib/shared/utils/Ecco';
import type { TMailItemFactoryOptions, TSendMailOptions } from '$lib/@types/Mailer';
import { ResendMailer } from '../func/mailers/Resend';
import { comm_items, CommItemProvider, type CommItemsInsert } from '../db/schema/comm_items.schema';

export const CommServices = {
	findTemplateBy: async ({
		id,
		templateName,
		language
	}: {
		id?: string;
		templateName?: string;
		language?: string;
	}) => {
		// Find the template by id, name, or language
		const result = await db
			.select()
			.from(comm_template_entries)
			.innerJoin(comm_templates, eq(comm_template_entries.comm_template_id, comm_templates.id))
			.where(
				and(
					id ? eq(comm_templates.id, id) : undefined,
					templateName ? eq(comm_templates.name, templateName) : undefined,
					language ? eq(comm_template_entries.language, language) : undefined
				)
			);

		// Return the first result or null
		return result?.[0] || null;
	},
	/**
	 * This function creates an email object from a template and variables.
	 * @param template - The template to use. Can be a template name or id.
	 * @param language - The language to use. Default is 'en' if not provided.
	 * @param contacts - The contacts to send the email to.
	 * @param variables - The variables to be parsed in the template.
	 * @returns The email object.
	 */
	emailFactory: async ({ template, language, contacts, variables }: TMailItemFactoryOptions) => {
		// Find the template entry by name or id and language
		const templateEntry = await CommServices.findTemplateBy({
			templateName: template?.name || undefined,
			id: template?.id || undefined,
			language: language || 'en'
		});

		// If the template entry is not found, log an error and throw an error
		if (!templateEntry) {
			Ecco.error('comm', 'Template not found', {
				templateName: template?.name,
				id: template?.id,
				language
			});
			throw new Error('Template not found');
		}

		// Get the subject and body of the template entry
		const { subject, body } = templateEntry.comm_template_entries;

		// Parse the subject of the template entry
		let parsedSubject = typeof subject === 'string' ? subject : '';
		for (const [key, value] of Object.entries(variables)) {
			if (typeof parsedSubject === 'string') {
				parsedSubject = parsedSubject.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
			}
		}

		// Parse the body of the template entry
		let parsedBody = typeof body === 'string' ? body : '';
		for (const [key, value] of Object.entries(variables)) {
			if (typeof parsedBody === 'string') {
				parsedBody = parsedBody.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
			}
		}

		// Return the email object for use in all mailers.
		return {
			from: templateEntry.comm_template.from,
			to: contacts.to,
			cc: contacts.cc,
			bcc: contacts.bcc,
			subject: parsedSubject,
			body: parsedBody,
			replyTo: templateEntry.comm_template.reply_to
		} as TSendMailOptions;
	},
	createCommItem: async ({
		mail,
		template,
		provider,
		variables
	}: {
		mail: TSendMailOptions;
		template: CommTemplates;
		provider: CommItemProvider;
		variables: Record<string, string>;
	}) => {
		const payload: CommItemsInsert = {
			comm_template_id: template.id,
			provider: provider,
			from: mail.from,
			to: Array.isArray(mail.to) ? mail.to.join(', ') : mail.to,
			cc: Array.isArray(mail.cc) ? mail.cc : mail.cc ? [mail.cc] : [],
			bcc: Array.isArray(mail.bcc) ? mail.bcc : mail.bcc ? [mail.bcc] : [],
			reply_to: template.reply_to || '',
			subject: mail.subject,
			html: mail.body,
			text: mail.text
		};

		const commItem = await db.insert(comm_items).values(payload).returning();

		if (!commItem) {
			Ecco.error('comm', 'Failed to create comm item', {
				payload,
				variables
			});
			throw new Error('Failed to create comm item');
		}

		// TODO: Store variables in a separate table for tracking
		Ecco.info('comm', 'Comm item created', {
			commItemId: commItem[0].id,
			variables
		});

		return commItem[0];
	},
	/**
	 * This function creates a mailer based on the provider.
	 * @param provider - The provider to create a mailer for.
	 * @returns The mailer.
	 */
	createMailer: (provider: CommItemProvider) => {
		switch (provider) {
			case CommItemProvider.SENDGRID:
				throw new Error('SendGrid mailer not implemented yet');
			case CommItemProvider.MAILGUN:
				throw new Error('MailGun mailer not implemented yet');
			case CommItemProvider.RESEND:
				return ResendMailer;
			default:
				throw new Error(`Unknown provider: ${provider}`);
		}
	}
};
