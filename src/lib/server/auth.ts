import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index';
import { anonymous, apiKey, emailOTP } from 'better-auth/plugins';
import { PRIVATE_BETTER_AUTH_APP_NAME, PRIVATE_TRUSTED_ORIGINS } from '$env/static/private';
import { ResendMailer } from './func/mailers/Resend';
import { createMailer } from './func/mailers/Mailer';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true
	}),
	appName: PRIVATE_BETTER_AUTH_APP_NAME,
	session: {
		storeSessionInDatabase: true,
		sessionLength: 1000 * 60 * 60 * 24 * 365, // 1 year
		expiresIn: 1000 * 60 * 60 * 24 * 365, // 1 year
		additionalFields: {}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		autoSignUp: true
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
	trustedOrigins: PRIVATE_TRUSTED_ORIGINS.split(','),
	plugins: [
		anonymous(),
		apiKey(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				console.log(email, otp, type);
				const mailer = createMailer("resend");
				mailer.send({
					to: email,
					html: `<p>${otp}</p>`
				})
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
