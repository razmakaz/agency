<script lang="ts">
	import Ecco from "$lib/shared/utils/Ecco";
	import { post } from "$lib/shared/utils/Fetcher";


    let code: number | undefined = $state()

	// TODO: Add a toast here
    const validateOtp = async () => {
		if(!code) return;
		await post("/otp-auth", { body: JSON.stringify(code) }).catch(error => Ecco.error("otp-auth", error))
	}

</script>

<main class="mx-auto flex h-screen max-w-7xl items-center justify-center px-4">
	<section
		class="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-md"
	>
		<h1 class="text-center text-3xl font-bold">Enter Code</h1>

		<div class="flex flex-col space-y-2">
			<label for="code" class="text-lg font-medium">OTP:</label>
			<input
				type="text"
				name="code"
				bind:value={code}
				class="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500 text-black"
			/>
		</div>

		<button
			type="button"
			class="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			onclick={validateOtp}
		>
			Submit
		</button>
	</section>
</main>
