<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth-client';
	import { DeviceFingerprint } from '$lib/client/utils/DeviceFingerprint';
	import Ecco from '$lib/shared/utils/Ecco';
	import { post } from '$lib/shared/utils/Fetcher';
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

	const session = authClient.useSession();

	let email: string = $state(page.url.searchParams.get('email') || '');

	// TODO: Add a toast for failed email input
	const sendOtp = async (event: Event) => {
		event.preventDefault();

		if (!email) return;

		// Generate the device fingerprint
		const fingerprinter = new DeviceFingerprint();
		const { fingerprint, confidence } = await fingerprinter.generate();
		console.log('deviceFingerprint', fingerprint, confidence);

		await post('/login', { body: JSON.stringify({ email, fingerprint, confidence }) })
			.then((response) => {
				const url = new URL(window.location.href);
				url.pathname = '/otp-auth';
				url.searchParams.set('email', email);
				goto(url.toString());
				Ecco.info('login', response);
			})
			.catch((error) => Ecco.error('login', error));
	};

	const onInteract = async () => {
		if ($session.data && !$session.data.user.isAnonymous) {
			goto('/');
			return;
		}
		// TODO: This is being implemented incorrectly.
		// Each time the user arrives on the page, it's creating
		// a new session, misrepresenting the amount of users
		// visiting the page.
		// authClient.signIn.anonymous();
	};
</script>

<svelte:window on:click={onInteract} />

<main class="mx-auto flex h-screen max-w-7xl items-center justify-center px-4">
	<section class="card bg-base-200 flex w-full max-w-md justify-center space-y-6 rounded-lg p-8">
		<h1 class="text-center text-3xl font-bold">{m.auth_login_title()}</h1>

		<form onsubmit={sendOtp} class="flex flex-col gap-2">
			<label for="email" class="col-span-2 font-medium">{m.auth_login_email()}</label>
			<div class="flex w-full items-center gap-2">
				<input type="email" name="email" bind:value={email} class="input w-full" />
				<button type="submit" class="btn btn-primary" disabled={!email}>
					{m.auth_login_submit()}
				</button>
			</div>
			<p class="col-span-2 text-center text-sm text-gray-500">{m.auth_login_notice()}</p>
		</form>
	</section>
</main>
