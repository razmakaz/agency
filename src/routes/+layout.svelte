<script lang="ts">
	import { authClient } from '$lib/client/auth-client';
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';

	// console.log(m);
	let { children } = $props();

	let state = $state({
		ready: false
	});

	const session = authClient.useSession();

	session.subscribe((data) => {
		if (data.isPending) {
			return;
		}

		if (!data.data || data.data.user.isAnonymous) {
			// This is a hack to prevent the root page
			// from flashing before the session is ready
			setTimeout(() => {
				state.ready = true;
			}, 10);
			// goto('/login');
		}
	});
</script>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

{#if state.ready}
	{@render children()}
{/if}
