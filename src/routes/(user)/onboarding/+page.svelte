<script lang="ts">
	import OnboardingWrapper from '$lib/client/components/Onboarding/OnboardingWrapper.svelte';
	import { AppState } from '$lib/client/stores/AppState';

	const { data } = $props();

	AppState.update((state) => ({
		...state,
		navEnabled: false
	}));
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<OnboardingWrapper entries={data.incompleteEntries} />
</div>
