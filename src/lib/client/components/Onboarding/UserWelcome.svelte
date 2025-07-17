<script lang="ts">
	import { addToast } from '$lib/client/stores/ToastStore';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { Fetcher } from '$lib/shared/utils/Fetcher';

	const { entry, state: wrapperState } = $props();

	let componentState = $state({
		ready: false,
		acceptTerms: false,
		optIn: false
	});

	$effect(() => {
		wrapperState.canNext = componentState.acceptTerms;
	});

	const init = async () => {
		const contactData = await Fetcher.get('/api/me');
		console.log({ contactData });
		// componentState.acceptTerms = contactData.accepted_terms_on ? true : false;
		// componentState.optIn = contactData.opt_in_on ? true : false;

		wrapperState.canSkip = entry.skippable;
		setTimeout(() => {
			componentState.ready = true;
		}, 1);

		wrapperState.onNext = async () => {
			// We can't continue if terms hasn't been checked, so return;
			if (!componentState.acceptTerms) return;

			// Set dates if checked, otherwise null
			const payload = {
				accepted_terms_at: componentState.acceptTerms ? new Date() : null,
				opt_in_at: componentState.optIn ? new Date() : null
			};
			// Update the contact
			const data = await fetch('/api/me', {
				method: 'PATCH',
				body: JSON.stringify(payload)
			})
				.then((res) => res.json())
				.catch((err) => {
					console.error(err);
					addToast({
						title: 'Error',
						message: 'Something went wrong. Please try again.',
						type: 'error'
					});
				});

			addToast({
				title: 'Profile Updated',
				message: 'Thank you.',
				type: 'success'
			});
			wrapperState.activeEntryIndex++;
		};
	};

	onMount(() => {
		init();
	});
</script>

<div class="flex flex-col items-center justify-center gap-4 p-4">
	<div class="relative">
		<h1
			class="from-primary to-secondary inline-block bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.onboarding_welcome_title()}
		</h1>

		<div
			class="from-primary to-secondary absolute bottom-1 h-px bg-gradient-to-r transition-all duration-1000 {componentState.ready
				? '-inset-x-0 opacity-100'
				: 'inset-x-16 opacity-0'}"
		></div>
	</div>

	<div class="text-center">
		<p class="text-lg">
			{@html m.onboarding_welcome_description()}
		</p>
	</div>
	<div class="flex flex-col items-start gap-2">
		<div class="flex items-center gap-2 text-center">
			<input
				type="checkbox"
				class="checkbox bg-base-300 h-6 w-6"
				bind:checked={componentState.optIn}
			/>
			<div class="text-base-content/50 text-sm">
				{@html m.onboarding_welcome_opt_in()}
			</div>
		</div>
		<div class="flex items-center gap-2 text-center">
			<input
				type="checkbox"
				class="checkbox bg-base-300 h-6 w-6"
				bind:checked={componentState.acceptTerms}
			/>
			<div class="text-base-content/50 text-sm">
				{@html m.onboarding_welcome_accept_description()}
			</div>
		</div>
	</div>
</div>
