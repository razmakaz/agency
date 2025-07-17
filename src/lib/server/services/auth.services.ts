import { auth } from '$lib/server/auth';

export const AuthServices = {
	isAuthed: async (request: Request) => {
		const session = await auth.api.getSession({
			headers: request.headers
		});
		return session !== null;
	}
};
