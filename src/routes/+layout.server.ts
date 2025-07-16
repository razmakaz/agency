export const load = async ({ cookies, url }) => {
	if (url.pathname === '/login' && url.searchParams.get('delete_cookies')) {
		// delete all cookies
		const _cookies = cookies.getAll();
		_cookies.forEach((cookie) => {
			cookies.delete(cookie.name, {
				path: '/'
			});
		});
	}
};
