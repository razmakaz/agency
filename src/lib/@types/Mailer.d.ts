import z4 from 'zod/v4';
import type { Email, EmailOrEmailArray } from './CommonZod';
import type { CommItemProvider } from '$lib/server/db/schema/comm_items.schema';

export const SendMailOptions = z4.object({
	from: Email,
	to: EmailOrEmailArray,
	cc: EmailOrEmailArray.optional(),
	bcc: EmailOrEmailArray.optional(),
	subject: z4.string(),
	body: z4.string().optional(),
	text: z4.string().optional(),
	replyTo: Email.optional()
});

export type TSendMailOptions = z4.infer<typeof SendMailOptions>;

// Mailer function type - takes parsed email options and sends via provider
export type TMailerFn = {
	send: (mail: TSendMailOptions) => Promise<unknown>;
};

// Options for creating email from template
export const MailItemFactoryOptions = z4.object({
	template: z4.object({
		name: z4.string().optional(),
		id: z4.string().optional()
	}),
	language: z4.string().optional(),
	contacts: z4.object({
		to: z4.array(z4.string()),
		cc: z4.array(z4.string()).optional(),
		bcc: z4.array(z4.string()).optional()
	}),
	variables: z4.record(z4.string()),
	provider: z4.nativeEnum(CommItemProvider).optional()
});
export type TMailItemFactoryOptions = z4.infer<typeof MailItemFactoryOptions>;

// Simple send options for basic usage (like auth)
export const SimpleSendOptions = z4.object({
	template: z4.object({
		name: z4.string().optional(),
		id: z4.string().optional()
	}),
	to: z4.array(z4.string()),
	language: z4.string().optional(),
	variables: z4.record(z4.string())
});
export type TSimpleSendOptions = z4.infer<typeof SimpleSendOptions>;
