import { PRIVATE_RESEND_API_KEY } from '$env/static/private';
import type { TMailerFn, TSendMailOptions } from '$lib/@types/Mailer';
import { Resend } from 'resend';

export const ResendMailer: TMailerFn = {
	send: async (mail: TSendMailOptions) => {
		// Create a new Resend client
		const resend = new Resend(PRIVATE_RESEND_API_KEY);

		const result = await resend.emails.send({
			...mail,
			react: undefined
		});

		if (!result) {
			throw new Error('Failed to send email');
		}

		return result;
	}
};
