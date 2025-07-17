import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { Services } from '$lib/server/services/Servicer';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const authHook: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
};

export const authCheck: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.user = session?.user;

	const unauthedRoutePatterns = [
		/^\/api\/whitelabel\/theme/, // /api/whitelabel/theme/...
		/^\/login/, // /login/...
		/^\/otp-auth/, // /otp-auth/...
		/^\/seed/ // /api/seed/...
	];

	if (unauthedRoutePatterns.some((pattern) => pattern.test(event.url.pathname))) {
		return resolve(event);
	}

	if (!(await Services.auth.isAuthed(event.request))) {
		if (event.url.pathname.startsWith('/api')) {
			return new Response('Unauthorized', { status: 401 });
		} else {
			return new Response(null, {
				status: 302,
				headers: { Location: '/login' }
			});
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, authHook, authCheck);
