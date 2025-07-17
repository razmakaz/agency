<script lang="ts">
	import { authClient } from '$lib/client/auth-client';
	import '../app.css';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import ToastContainer from '$lib/client/components/Toaster/ToastContainer.svelte';
	import Navbar from '$lib/client/components/Nav/Navbar.svelte';
	import MobileNavbar from '$lib/client/components/Nav/MobileNavbar.svelte';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	console.log('Theme CSS', data);

	let state = $state({
		ready: false
	});

	const session = authClient.useSession();

	session.subscribe((data) => {
		if (data.isPending) {
			return;
		}

		console.log('session', $session);

		if (!data.data || data.data.user.isAnonymous) {
			// This is a hack to prevent the root page
			// from flashing before the session is ready
			setTimeout(() => {
				state.ready = true;
			}, 10);
			// goto('/login');
		} else {
			state.ready = true;
		}
	});

	onMount(() => {
		const style = document.createElement('style');
		style.textContent = data.themeCss;
		document.head.appendChild(style);
	});
</script>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<ToastContainer />

{#if state.ready}
	<div
		class="grid min-h-screen min-w-screen grid-rows-[1fr_auto] lg:grid-cols-[auto_1fr] lg:grid-rows-[1fr]"
	>
		{#if $session.data?.user}
			<Navbar />
		{/if}
		<div class="flex-1">
			{@render children()}
		</div>
		{#if $session.data?.user}
			<MobileNavbar />
		{/if}
	</div>
{/if}
