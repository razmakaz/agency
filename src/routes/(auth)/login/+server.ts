import type { DataResponse } from '$lib/@types/Fetcher.js';
import { authClient, signIn } from '$lib/client/auth-client';
import Ecco from '$lib/shared/utils/Ecco.js';

export const POST = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();

		// TODO: Implement the fingerprint and confidence

		const { data, error } = await authClient.emailOtp.sendVerificationOtp({
			email: body.email,
			type: 'sign-in'
		});

		if (data === null || error) {
			Ecco.debug('login', { requestBody: body.email, error: error });
			throw new Error(`${error.message}`);
		}

		Ecco.debug('login', { requestBody: body.email, otpResponse: data });

		const res: DataResponse<boolean> = {
			success: true
		};
		return new Response(JSON.stringify(res), { status: 200 });
	} catch (error) {
		const res: DataResponse<unknown> = {
			success: false,
			errors: [(error as Error).message]
		};
		return new Response(JSON.stringify(res), { status: 500 });
	}
};
