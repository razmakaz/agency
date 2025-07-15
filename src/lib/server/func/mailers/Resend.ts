import { PRIVATE_RESEND_API_KEY } from '$env/static/private';
import type { TMailerFn, TSendMailOptions } from '$lib/@types/Mailer';
import Ecco from '$lib/shared/utils/Ecco';
import { Resend } from 'resend';

export const ResendMailer: TMailerFn = {
	send: async (mail: TSendMailOptions) => {
		// Create a new Resend client
		const resend = new Resend(PRIVATE_RESEND_API_KEY);

		const { data, error } = await resend.emails.send({
			...mail,
			html: mail.body,
			react: undefined
		});

		Ecco.info('ResendMailer', data, error);

		if (error) {
			throw new Error(error.message);
		}

		return data;
	}
};
