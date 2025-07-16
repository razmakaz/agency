<script lang="ts">
	import Ecco from '$lib/shared/utils/Ecco';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

    // Gettings privacy tos data
	const { data }: PageProps = $props();
    const { latestPrivacy } = data as any;
</script>

<main class="mx-auto max-w-7xl">
    {#if latestPrivacy}
        {@html latestPrivacy}
    {/if}
</main>