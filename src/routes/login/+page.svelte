<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth-client';
	import Ecco from '$lib/shared/utils/Ecco';
	import { post } from '$lib/shared/utils/Fetcher';

	let email: string = $state('');

	// TOOD: Add a toast for failed email input
	const sendOtp = async () => {
		if (!email) return; 

		await post('/login', { body: JSON.stringify({ email }) })
			.then((response) => {
				goto('/otp-auth');
				Ecco.info('login', response);
			})
			.catch((error) => Ecco.error('login', error));

        // await authClient.emailOtp.sendVerificationOtp({
        //     email: email,
        //     type: "sign-in"
        // }).then(() => {
        //     goto("/otp-auth")
        // })
	};
</script>

<main class="mx-auto flex h-screen max-w-7xl items-center justify-center px-4">
	<section
		class="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-md"
	>
		<h1 class="text-center text-3xl font-bold">Login</h1>

		<div class="flex flex-col space-y-2">
			<label for="email" class="text-lg font-medium">Email:</label>
			<input
				type="email"
				name="email"
				bind:value={email}
				class="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500 text-black"
			/>
		</div>

		<button
			type="button"
			class="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			onclick={sendOtp}
		>
			Submit
		</button>
	</section>
</main>
