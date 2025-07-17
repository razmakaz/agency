<script lang="ts">
	import { addToast } from '$lib/client/stores/ToastStore';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { Fetcher } from '$lib/shared/utils/Fetcher';
	import { page } from '$app/state';
	import GradientUnderlineHeader from '../Stylish/GradientUnderlineHeader.svelte';
	import Icon from '@iconify/svelte';

	const { entry, state: wrapperState } = $props();

	let componentState = $state({
		ready: false,
		type: null as string | null
	});

	const userTypes = [
		{
			label: m.onboarding_type_partner(),
			value: 'partner',
			description: m.onboarding_type_partner_description(),
			icon: 'fluent:handshake-16-filled'
		},
		{
			label: m.onboarding_type_associate(),
			value: 'associate',
			description: m.onboarding_type_associate_description(),
			icon: 'streamline-plump:office-worker-solid'
		},
		{
			label: m.onboarding_type_client(),
			value: 'client',
			description: m.onboarding_type_client_description(),
			icon: 'ri:building-fill'
		}
	];

	$effect(() => {
		wrapperState.canNext = componentState.type !== null;
	});

	const init = async () => {
		const contactData = await Fetcher.get('/api/me');
		const { data } = contactData as { data: any };

		console.log({ data });
		// componentState.acceptTerms = contactData.accepted_terms_on ? true : false;
		// componentState.optIn = contactData.opt_in_on ? true : false;

		wrapperState.canSkip = entry.skippable;
		wrapperState.canNext = false;
		componentState.type = data.contact_type;
		setTimeout(() => {
			componentState.ready = true;
		}, 1);

		wrapperState.onNext = async () => {
			// We can't continue if terms hasn't been checked, so return;
			if (!componentState.type) return;

			// Set dates if checked, otherwise null
			const payload = {
				type: componentState.type
			};

			console.log({ payload });

			const url = new URL(
				`/api/onboardings/${wrapperState.user_id}/complete/type`,
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

<div class="flex flex-col items-center justify-center gap-4 py-4">
	<div class="text-2xl font-bold">{m.onboarding_profile_title()}</div>
	<div class="text-sm">{m.onboarding_profile_description()}</div>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<input class="input" type="text" placeholder={m.forms_first_name()} />
		<input class="input" type="text" placeholder={m.forms_last_name()} />
		<input class="input" type="text" placeholder={m.forms_email()} />
		<input class="input" type="text" placeholder={m.forms_phone()} />
		<input class="input" type="text" placeholder={m.forms_address_1()} />
		<input class="input" type="text" placeholder={m.forms_address_2()} />
		<input class="input" type="text" placeholder={m.forms_city()} />
		<input class="input" type="text" placeholder={m.forms_state()} />
		<input class="input" type="text" placeholder={m.forms_zip()} />
		<input class="input" type="text" placeholder={m.forms_country()} />
		<input class="input" type="text" placeholder={m.forms_preferred_name()} />
		<input class="input" type="text" placeholder={m.forms_legal_name()} />
		<input class="input" type="text" placeholder={m.forms_language()} />
		<input class="input" type="text" placeholder={m.forms_preferred_language()} />
	</div>
</div>
