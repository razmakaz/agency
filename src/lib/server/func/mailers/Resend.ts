import { PRIVATE_RESEND_API_KEY } from '$env/static/private';
import type { TMailerFn, TSendMailOptions } from '$lib/@types/Mailer';
import { Resend } from 'resend';
import { mailerUtils } from './Mailer';

export const ResendMailer: TMailerFn = {
	send: async (mail: TSendMailOptions) => {
		const { to, subject, body, text, cc, bcc, replyTo } = mail;

		const resend = new Resend(PRIVATE_RESEND_API_KEY);

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

		const result = await resend.emails.send(msg);

		// mailerUtils.recordEmail(msg);

		if (!result) {
			throw new Error('Failed to send email');
		}

		return result;
	}
};
