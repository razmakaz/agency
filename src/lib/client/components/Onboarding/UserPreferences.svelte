<script lang="ts">
	import { addToast } from '$lib/client/stores/ToastStore';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { Fetcher } from '$lib/shared/utils/Fetcher';
	import { page } from '$app/state';

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

			console.log({ payload });

			const url = new URL(
				`/api/onboardings/${wrapperState.user_id}/complete/welcome`,
				page.url.origin
			);
			// Update the contact
			const data = await fetch(url, {
				method: 'POST',
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

<div class="flex flex-col items-center justify-center gap-4 p-4">asdf</div>
