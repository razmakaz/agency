import z4 from 'zod/v4';
import type { Email, EmailOrEmailArray } from './CommonZod';

export const MailerOptions = z4.object({
	strategy: z4.enum(['sendgrid', 'mailgun', 'resend'])
});

export const SendMailOptions = z4.object({
	to: EmailOrEmailArray,
	cc: EmailOrEmailArray.optional(),
	bcc: EmailOrEmailArray.optional(),
	subject: z4.string(),
	body: z4.string().optional(),
	text: z4.string().optional(),
	replyTo: Email.optional()
});

export type TMailerOptions = z4.infer<typeof MailerOptions>;
export type TSendMailOptions = z4.infer<typeof SendMailOptions>;

// Explicitly define the TMailerFn type as an object with a required send method
export type TMailerFn = {
	send: (mail: TSendMailOptions) => Promise<unknown>;
};
