import { ResendMailer } from './Resend';
import { MailGunMailer } from './MailGun';
import { SendGridMailer } from './SendGrid';
import type { TMailerFn, TMailerOptions } from '$lib/@types/Mailer';
import { attempt, attemptAsync } from '$lib/shared/utils/Attempt';

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
