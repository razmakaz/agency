import { Services } from '$lib/server/services/Servicer.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url, locals }) => {
	if (url.pathname === '/login' && url.searchParams.get('delete_cookies')) {
		// delete all cookies
		const _cookies = cookies.getAll();
		_cookies.forEach((cookie) => {
			cookies.delete(cookie.name, {
				path: '/'
			});
		});
	}

	// Get the theme
	const themeUrl = new URL(url.toString());
	themeUrl.pathname = '/api/whitelabel/theme';
	const theme = await fetch(themeUrl.toString());
	const themeCss = await theme.text();

	if (!locals.user) {
		return {
			themeCss
		};
	}

	// If the user has incomplete onboarding entries, redirect to the onboarding page
	const hasIncompleteOnboardingEntries =
		await Services.onboardings.userHasIncompleteOnboardingEntries(locals.user?.id ?? '');
	if (
		hasIncompleteOnboardingEntries &&
		url.pathname !== '/onboarding' &&
		url.pathname !== '/logout'
	) {
		throw redirect(302, `/onboarding`);
	}

	return {
		themeCss
	};
};
