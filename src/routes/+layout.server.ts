import { auth } from '$lib/server/auth';

export const load = async ({ cookies, url }) => {
	if (url.pathname === '/login') {
		// delete all cookies
		const _cookies = cookies.getAll();
		_cookies.forEach((cookie) => {
			cookies.delete(cookie.name, {
				path: '/'
			});
		});
	}
};
