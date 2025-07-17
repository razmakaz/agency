<script lang="ts">
	import { onMount } from 'svelte';
	import UserWelcome from './UserWelcome.svelte';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
	import { scale } from 'svelte/transition';

	const { entries } = $props();

	const animationDuration = 444;

	let state = $state({
		activeEntryIndex: 0,
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

	onMount(() => {
		console.log(entries);
	});
</script>

<div class="card bg-base-200 p-4">
	{#if activeItem.target_type === 'user'}
		{#if activeItem.name === 'welcome'}
			<UserWelcome entry={activeItem} {state} />
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
