<script lang="ts">
	import { flip } from 'svelte/animate';
	import { addToast, removeToast, ToastStore } from '$lib/client/stores/ToastStore.js';
	import { onDestroy, onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	const toasts = $derived($ToastStore);

	let timer: NodeJS.Timeout | null = null;

	onMount(() => {
		if (timer) {
			clearTimeout(timer);
		}

		timer = setInterval(() => {
			$ToastStore.forEach((toast) => {
				if (toast.createdAt + toast.duration < Date.now()) {
					console.log('removeToast', toast.id);
					removeToast(toast.id);
				}
			});
		}, 100);
	});

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
</script>

<div
	class="pointer-events-none absolute inset-0 top-0 right-0 z-50 flex justify-end overflow-hidden p-4"
>
	<div class="flex max-w-sm flex-col items-end gap-2">
		{#each toasts as toast (toast.id)}
			<div
				animate:flip
				class="flex flex-col bg-{toast.type} text-{toast.type}-content rounded-md border-2 shadow-lg border-{toast.type} overflow-hidden"
				transition:fly={{ duration: 333, x: 100 }}
			>
				<div
					class="bg-base-100 text-{toast.type} relative grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2 py-1 font-bold"
				>
					{#if toast.icon}
						<Icon icon={toast.icon} />
					{:else}
						<div></div>
					{/if}
					<span>{toast.title}</span>

					{#if toast.closable}
						<button class="pointer-events-auto" onclick={() => removeToast(toast.id)}>
							<Icon icon="mdi:close" width={16} height={16} />
						</button>
					{:else}
						<div></div>
					{/if}
				</div>
				<hr />
				<div class="px-2 py-1">
					{#if toast.message}
						<span>{@html toast.message}</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
