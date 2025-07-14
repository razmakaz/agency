import { PRIVATE_SENDGRID_API_KEY } from '$env/static/private';
import type { TMailerFn, TSendMailOptions } from '$lib/@types/Mailer';
import sgMail from '@sendgrid/mail';

export const SendGridMailer = (): TMailerFn => {
	return {
		send: async (mail: TSendMailOptions) => {
			const { to, subject, body, text, cc, bcc, replyTo } = mail;

			sgMail.setApiKey(PRIVATE_SENDGRID_API_KEY);

			const msg = {
				to,
				from: 'test@example.com',
				subject,
				html: body,
				text,
				cc,
				bcc,
				replyTo
			};

			const result = await sgMail.send(msg);
			if (!result) {
				throw new Error('Failed to send email');
			}

			return result;
		}
	};
};
