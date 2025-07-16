<script lang="ts">
	// Gettings latest tos data
	const { data } = $props();
	const { latestTos } = data as any;
</script>

<main class="mx-auto max-w-7xl">
	{#if latestTos}
		{@html latestTos.content}
	{/if}
</main>