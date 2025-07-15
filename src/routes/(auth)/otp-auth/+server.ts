import type { DataResponse } from '$lib/@types/Fetcher.js';
import { authClient } from '$lib/client/auth-client.js';

export const POST = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();

		const data = await authClient.signIn.emailOtp({
			email: body.email,
			otp: body.otp
		});

		const res: DataResponse<string> = {
			success: true,
			data: JSON.stringify(data)
		};
		return new Response(JSON.stringify(res), { status: 500 });
	} catch (error) {
		const res: DataResponse<unknown> = {
			success: false,
			errors: [...(error as Error).message]
		};
		return new Response(JSON.stringify(res), { status: 500 });
	}
};
