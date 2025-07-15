<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth-client';
	import { onDestroy, onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	const session = authClient.useSession();

	const state = $state({
		timer: 5,
		timerId: null as NodeJS.Timeout | null
	});

	session.subscribe((data) => {
		if (data.isPending) {
			return;
		}

		if (data.data) {
			authClient.signOut();
			state.timerId = setInterval(() => {
				state.timer--;
			}, 1000);
		}
	});

	onDestroy(() => {
		if (state.timerId) {
			clearInterval(state.timerId);
		}
	});
</script>

<div class="flex h-screen w-screen items-center justify-center">
	{#if $session.isPending}
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-2xl font-bold">{m.auth_logout_working()}</h1>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-2xl font-bold">{m.auth_logout_working()}</h1>
			<p>{m.auth_logout_redirecting_in({ timer: state.timer })}</p>
			<a href="/login" class="text-blue-500">{m.auth_logout_go_to_login()}</a>
		</div>
	{/if}
</div>
