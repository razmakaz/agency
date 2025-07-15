import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index';
import { anonymous, apiKey, emailOTP } from 'better-auth/plugins';
import { createMailer } from './func/mailers/Mailer';
import { configDotenv } from 'dotenv';
import Ecco from '$lib/shared/utils/Ecco';
import { CommItemProvider } from './db/schema';

// IMPORTANT:
// When you go to use `yarn auth:generate` or `npx @better-auth/cli generate`
// You *MUST* temporarily remove outside references, like
// the createMailer. BetterAuth can't resolve aliased paths defined by vite used
// throughout the application and it'll bitch and moan about it.
//
// After generating, you can re-add your references.

configDotenv();

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true
	}),
	appName: process.env.PRIVATE_BETTER_AUTH_APP_NAME,
	session: {
		storeSessionInDatabase: true,
		sessionLength: 60 * 60 * 24 * 365, // 1 year
		expiresIn: 60 * 60 * 24 * 365 // 1 year
	},
	socialProviders: {
		google: {
			enabled: true,
			clientId: '',
			clientSecret: ''
		},
		github: {
			enabled: true,
			clientId: '',
			clientSecret: ''
		},
		linkedin: {
			enabled: true,
			clientId: '',
			clientSecret: ''
		},
		apple: {
			enabled: true,
			clientId: '',
			clientSecret: ''
		},
		microsoft: {
			enabled: true,
			clientId: '',
			clientSecret: ''
		}
	},
	trustedOrigins: process.env.PRIVATE_TRUSTED_ORIGINS?.split(',') || [],
	plugins: [
		anonymous(),
		apiKey(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				console.log(email, otp, type);
				await createMailer(CommItemProvider.RESEND)
					.send({
						template: { name: 'otp-verification' },
						to: [email],
						variables: {
							otp: otp,
							type: type
						}
					})
					.catch((err: Error) => {
						Ecco.debug('login', { error: err });
						if (err.message.includes('Template not found')) {
							throw new Error('Template not found. Did you seed your database? 🤔');
						} else {
							throw err;
						}
					});
			}
		})
		// mcp({
		// 	loginPage: '/auth'
		// })
		// phoneNumber({
		// 	sendOTP: async ({ phoneNumber, code }) => {
		// 		console.log(phoneNumber, code);
		// 	}
		// })
	]
});
