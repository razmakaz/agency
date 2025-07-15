import z4 from 'zod/v4';
import type { Email, EmailOrEmailArray } from './CommonZod';

export const MailerOptions = z4.object({
	strategy: z4.enum(['sendgrid', 'mailgun', 'resend'])
});

export const SendMailOptions = z4.object({
	to: EmailOrEmailArray,
	cc: EmailOrEmailArray,
	bcc: EmailOrEmailArray,
	subject: z4.string(),
	// One of but not both, body and text, are required
	...z4.union([
		z4.object({ text: z4.string(), body: z4.undefined().optional() }),
		z4.object({ body: z4.string(), text: z4.undefined().optional() })
	]),
	replyTo: Email.optional()
});

export type TMailerOptions = z4.infer<typeof MailerOptions>;
export type TSendMailOptions = z4.infer<typeof SendMailOptions>;

// Explicitly define the TMailerFn type as an object with a required send method
export type TMailerFn = {
	send: (mail: TSendMailOptions) => Promise<unknown>;
};
