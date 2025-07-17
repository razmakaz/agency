<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import UserWelcome from './UserWelcome.svelte';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
	import { scale } from 'svelte/transition';
	import { authClient } from '$lib/client/auth-client';
	import UserProfile from './UserProfile.svelte';
	import UserPreferences from './UserPreferences.svelte';
	import UserType from './UserType.svelte';

	const { entries } = $props();

	const animationDuration = 444;

	const session = authClient.useSession();

	let state = $state({
		activeEntryIndex: 0,
		user_id: '',
		showControls: true,
		showProgress: false,
		canSkip: false,
		canBack: false,
		canNext: false,
		onNext: () => {},
		onBack: () => {
			state.activeEntryIndex--;
		},
		onSkip: () => {}
	});

	let activeItem = $derived(entries[state.activeEntryIndex]);
	let isLastEntry = $derived(state.activeEntryIndex === entries.length - 1);

	$effect(() => {
		state.canSkip = activeItem.skippable;
		state.canBack = state.activeEntryIndex > 0;
	});

	let unsub: () => void;

	onMount(() => {
		console.log(entries);
		unsub = session.subscribe((session) => {
			state.user_id = session?.data?.user?.id ?? '';
		});
	});

	onDestroy(() => {
		unsub?.();
	});
</script>

<div class="card bg-base-200 p-4">
	{#if activeItem.target_type === 'user'}
		{#if activeItem.name === 'welcome'}
			<UserWelcome entry={activeItem} {state} />
		{/if}
		{#if activeItem.name === 'type'}
			<UserType entry={activeItem} {state} />
		{/if}
		{#if activeItem.name === 'profile'}
			<UserProfile entry={activeItem} {state} />
		{/if}
		{#if activeItem.name === 'preferences'}
			<UserPreferences entry={activeItem} {state} />
		{/if}
	{/if}
	{#if state.showControls}
		<div class="grid grid-cols-[auto_1fr_auto] gap-4">
			<div class="flex items-center gap-2">
				<button class="btn btn-primary" disabled={!state.canBack} onclick={state.onBack}>
					<Icon icon="mdi:arrow-left" />
					<span>{m.common_back()}</span>
				</button>
			</div>
			<div></div>
			<div class="flex items-center gap-2">
				<button class="btn btn-primary" disabled={!state.canSkip} onclick={state.onSkip}>
					<span>{m.common_skip()}</span>
				</button>
				{#if !isLastEntry}
					<button class="btn btn-primary" disabled={!state.canNext} onclick={state.onNext}>
						<span>{m.common_next()}</span>
						<Icon icon="mdi:arrow-right" />
					</button>
				{:else}
					<button class="btn btn-primary" disabled={!state.canNext} onclick={state.onNext}>
						<span>{m.common_finish()}</span>
						<Icon icon="mdi:check" />
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
