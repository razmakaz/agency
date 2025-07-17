import { auth } from '$lib/server/auth.js';
import { Servicer } from '$lib/server/services/Servicer.js';
import { OnboardingStepTargetType } from '$lib/server/db/schema/onboarding_steps.schema.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url, request, locals }) => {
	if (url.pathname === '/login' && url.searchParams.get('delete_cookies')) {
		// delete all cookies
		const _cookies = cookies.getAll();
		_cookies.forEach((cookie) => {
			cookies.delete(cookie.name, {
				path: '/'
			});
		});
	}

	const session = await auth.api.getSession({
		headers: request.headers
	});

	locals.user = session?.user ?? undefined;

	const themeUrl = new URL(url.toString());
	themeUrl.pathname = '/api/whitelabel/theme';
	const theme = await fetch(themeUrl.toString());
	const themeCss = await theme.text();

	// console.log('Session data', session);

	const hasIncompleteOnboardingEntries =
		await Servicer.onboardings.userHasIncompleteOnboardingEntries(locals.user?.id ?? '');
	if (hasIncompleteOnboardingEntries && url.pathname !== '/onboarding') {
		throw redirect(302, `/onboarding`);
	}

	return {
		themeCss
	};
};
