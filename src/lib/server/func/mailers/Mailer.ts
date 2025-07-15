import { CommServices } from '../../services/comm.services';
import { CommItemProvider } from '../../db/schema';
import type { TSimpleSendOptions, TMailItemFactoryOptions } from '$lib/@types/Mailer';
import Ecco from '$lib/shared/utils/Ecco';

/**
 * Creates a mailer instance for the specified provider
 * @param provider - The email provider to use
 * @returns A mailer object with a send method
 */
export const createMailer = (provider: CommItemProvider) => {
	// Normalize provider name

	return {
		/**
		 * Sends an email using a template
		 * @param options - The email options including template, recipients, and variables
		 * @returns Promise that resolves when email is sent
		 */
		send: async (options: TSimpleSendOptions) => {
			try {
				// Convert simple options to full mailer options
				const mailerOptions: TMailItemFactoryOptions = {
					template: options.template,
					language: options.language || 'en',
					contacts: {
						to: options.to,
						cc: [],
						bcc: []
					},
					variables: options.variables,
					provider: provider
				};

				// Generate the email from template
				const mailItem = await CommServices.emailFactory(mailerOptions);

				// Get the template for tracking
				const templateEntry = await CommServices.findTemplateBy({
					templateName: options.template?.name,
					id: options.template?.id,
					language: options.language || 'en'
				});

				if (!templateEntry) {
					throw new Error('Template not found');
				}

				// Create mailer instance
				const mailer = CommServices.createMailer(provider);

				// Send the email
				const result = await mailer.send(mailItem);

				// Create comm item for tracking
				await CommServices.createCommItem({
					mail: mailItem,
					template: templateEntry.comm_template,
					provider: provider,
					variables: options.variables as Record<string, string>
				});

				Ecco.info('mailer', 'Email sent successfully', {
					provider: provider,
					template: options.template?.name || options.template?.id,
					to: options.to
				});

				return result;
			} catch (error) {
				Ecco.error('mailer', 'Failed to send email', {
					provider: provider,
					template: options.template?.name || options.template?.id,
					to: options.to,
					error: error instanceof Error ? error.message : String(error)
				});
				throw error;
			}
		}
	};
};
