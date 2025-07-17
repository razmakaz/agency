<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { AppState } from '$lib/client/stores/AppState';

	let state = $state({
		active: 'Home'
	});

	const handleClick = (event: MouseEvent, label: string) => {
		state.active = label;
	};

	const menuItems = [
		{
			label: 'Home',
			idleIcon: 'iconamoon:home-bold',
			activeIcon: 'iconamoon:home-fill',
			href: '/'
		},
		{
			label: 'Money',
			idleIcon: 'teenyicons:money-outline',
			activeIcon: 'teenyicons:money-solid',
			href: '/about'
		},
		{
			label: 'Actions',
			idleIcon: 'iconamoon:lightning-1',
			activeIcon: 'iconamoon:lightning-1-fill',
			href: '/business'
		},
		{
			label: 'Reports',
			idleIcon: 'bx:chart',
			activeIcon: 'bxs:chart',
			href: '/reports'
		},
		{
			label: 'Profile',
			idleIcon: 'iconamoon:profile-light',
			activeIcon: 'iconamoon:profile-fill',
			href: '/profile'
		}
	];
</script>

<!-- Preload icons -->
<div class="hidden">
	{#each menuItems as item, index}
		<Icon icon={item.idleIcon} class="h-6 w-6 text-white" height={24} width={24} />
		<Icon icon={item.activeIcon} class="h-6 w-6 text-white" height={24} width={24} />
	{/each}
</div>

<div class="block lg:hidden {!$AppState.navEnabled ? '!hidden' : ''}">
	<div class="bg-neutral">
		<div class="relative flex items-center justify-center">
			{#each menuItems as item, index}
				<button
					id="mobile-nav-item-{index}"
					class="relative z-10 flex w-full max-w-28 flex-col items-center justify-center gap-2 py-2 transition-colors duration-[111ms] {state.active ===
					item.label
						? 'text-primary'
						: ''}"
					onclick={(event) => handleClick(event, item.label)}
				>
					<div class="relative flex h-6 w-6 flex-col items-center justify-center">
						{#if state.active === item.label}
							<div class="absolute" transition:fade={{ duration: 111 }}>
								<Icon icon={item.activeIcon} class="h-6 w-6 " />
							</div>
						{:else}
							<div class="absolute" transition:fade={{ duration: 111 }}>
								<Icon icon={item.idleIcon} class="h-6 w-6 " />
							</div>
						{/if}
					</div>
					<span class="text-xs {state.active === item.label ? '' : ' '}">
						{item.label}
					</span>
				</button>
			{/each}
		</div>
	</div>
</div>
