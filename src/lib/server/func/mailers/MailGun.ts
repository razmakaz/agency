import type { TMailerFn, TSendMailOptions } from '$lib/@types/Mailer';

export const MailGunMailer = (): TMailerFn => {
	return {
		send: async (mail: TSendMailOptions) => {
			const { to, subject, body, text, cc, bcc, replyTo } = mail;

			const msg = {
				to,
				from: 'test@example.com'
			};

			// const result = await mailgun.messages().send(msg);
			// if (!result) {
			//     throw new Error('Failed to send email');
			// }

			console.error('mailgun not implemented');

			return null;
		}
	};
};
