<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth-client';
	import { DeviceFingerprint } from '$lib/client/utils/DeviceFingerprint';
	import Ecco from '$lib/shared/utils/Ecco';
	import { post } from '$lib/shared/utils/Fetcher';
	import { m } from '$lib/paraglide/messages.js';

	const session = authClient.useSession();

	let email: string = $state('');

	// TODO: Add a toast for failed email input
	const sendOtp = async () => {
		if (!email) return;

		// Generate the device fingerprint
		const fingerprinter = new DeviceFingerprint();
		const { fingerprint, confidence } = await fingerprinter.generate();
		console.log('deviceFingerprint', fingerprint, confidence);

		await post('/login', { body: JSON.stringify({ email, fingerprint, confidence }) })
			.then((response) => {
				goto('/otp-auth');
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
		authClient.signIn.anonymous();
	};
</script>

<svelte:window on:click={onInteract} />

<main class="mx-auto flex h-screen max-w-7xl items-center justify-center px-4">
	<section class="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-md">
		<h1 class="text-center text-3xl font-bold">{m.auth_login_title()}</h1>

		<div class="flex flex-col space-y-2">
			<label for="email" class="text-lg font-medium">{m.auth_login_email()}:</label>
			<input
				type="email"
				name="email"
				bind:value={email}
				class="rounded-md border border-gray-300 p-3 text-black focus:border-blue-500 focus:ring-blue-500"
			/>
		</div>

		<button
			type="button"
			class="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			onclick={sendOtp}
		>
			{m.auth_login_submit()}
		</button>
	</section>
</main>
