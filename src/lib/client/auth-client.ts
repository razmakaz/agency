import { createAuthClient } from 'better-auth/svelte';
import { anonymousClient, emailOTPClient } from 'better-auth/client/plugins';
import { PUBLIC_BASE_URL } from '$env/static/public';

export const authClient = createAuthClient({
	baseURL: PUBLIC_BASE_URL,
	plugins: [emailOTPClient(), anonymousClient()]
});
