<script lang="ts">
	import { onMount } from 'svelte';

	const { children, formState, sectionName } = $props();

	let sectionState = $state({
		elements: [] as { type: string; name: string; value: string }[]
	});

	onMount(() => {});
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-2xl font-bold">{sectionName}</h2>
	{@render children(formState, sectionState)}
</div>
