<script lang="ts">
	import Ecco from '$lib/shared/utils/Ecco';
	import { post } from '$lib/shared/utils/Fetcher';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { scale } from 'svelte/transition';
	import { cubicOut, elasticInOut } from 'svelte/easing';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth-client';
	import { addErrorToast, addToast } from '$lib/client/stores/ToastStore';
	import { onMount } from 'svelte';

	// let otpCells: string[] = $state(Array(6).fill(''));
	// let currentFocusIndex = $state(0);
	// let isSubmitting = $state(false);
	const state = $state({
		otpCells: Array(6).fill(''),
		currentFocusIndex: 0,
		isSubmitting: false,
		ready: false,
		error: ''
	});

	const session = authClient.useSession();

	const email = $derived(page.url.searchParams.get('email') || '');

	const handleBackspace = (index: number) => {
		state.otpCells[index] = '';
		state.currentFocusIndex = index - 1;
		document.getElementById(`otp-cell-${state.currentFocusIndex}`)?.focus();
	};

	const handleClear = () => {
		state.otpCells = Array(6).fill('');
		state.currentFocusIndex = 0;
		state.error = '';
		document.getElementById(`otp-cell-0`)?.focus();
	};

	// Handle input changes
	const handleInput = (index: number, value: string, key: string) => {
		// Clear error, if any
		state.error = '';
		value = value.replace(/[^0-9]/g, '');

		// Handle backspace
		if (key === 'Backspace' || key === 'Delete' || key === 'ArrowLeft') {
			handleBackspace(index);
			return;
		}

		// Only allow single digits
		if (value.length > 1) {
			value = value.slice(-1);
		}

		state.otpCells[index] = value;

		// Auto-advance to next cell if digit entered
		if (value && index < 5) {
			state.currentFocusIndex = index + 1;
			document.getElementById(`otp-cell-${state.currentFocusIndex}`)?.focus();
		}
	};

	// Handle paste event
	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text');

		if (!pastedData || !/^\d{6}$/.test(pastedData)) {
			return;
		}

		// Fill all cells with pasted data
		state.otpCells = pastedData.split('');
		state.currentFocusIndex = 5; // Focus last cell
		document.getElementById(`otp-cell-${state.currentFocusIndex}`)?.focus();
	};

	// Get the complete OTP code
	const getOtpCode = () => state.otpCells.join('');

	// Check if all cells are filled
	const isComplete = () => state.otpCells.every((cell) => cell !== '');

	const onBackToLogin = () => {
		const url = new URL(window.location.href);
		url.pathname = '/login';
		goto(url.toString());
	};

	// TODO: Add a toast here
	const validateOtp = async () => {
		if (!isComplete()) return;

		state.isSubmitting = true;
		try {
			console.log('validateOtp', getOtpCode());

			authClient.signIn.emailOtp({
				otp: getOtpCode(),
				email: email as string,
				fetchOptions: {
					onSuccess: (data) => {
						session.subscribe((session) => {
							if (!session.isPending && session.data) {
								goto('/');
							} else {
								goto('/login');
							}
						});
					},
					onError: (error) => {
						Ecco.error('otp-client-auth', error);
						addErrorToast({
							title: 'Login Failed',
							message: error.error.message
						});
						setTimeout(() => {
							handleClear();
						}, 2000);
						state.error = error.error.message;
					}
				}
			});
		} catch (error) {
			Ecco.error('otp-auth', error);
		} finally {
			setTimeout(() => {
				state.isSubmitting = false;
			}, 1000);
		}
	};

	// Auto-submit when all cells are filled
	$effect(() => {
		if (isComplete()) {
			validateOtp();
		}
	});

	onMount(() => {
		document.getElementById('otp-cell-0')?.focus();
	});
</script>

<div class="hidden" id="preload-icons">
	<Icon icon="material-symbols:lock-outline" class="h-6 w-6 text-gray-400" />
	<Icon icon="material-symbols:lock-open-rounded" class="h-6 w-6 text-green-600" />
	<Icon icon="gg:spinner" class="h-6 w-6 animate-spin" />
</div>

<main class="mx-auto flex h-screen max-w-7xl items-center justify-center px-4">
	<section class="card bg-base-200 w-full max-w-md space-y-8 rounded-lg p-8 shadow-md">
		<div class="space-y-2 text-center">
			<h1 class="text-3xl font-bold">{m.otp_auth_title()}</h1>
			<p class="opacity-80">
				{@html m.otp_auth_description({ email })}
			</p>
		</div>

		<div class="">
			<div class="flex items-center justify-center space-x-3" onpaste={handlePaste}>
				{#each state.otpCells as cell, index}
					<div class="relative">
						{#if state.otpCells[index]}
							<div
								transition:scale={{ duration: 111, easing: cubicOut }}
								class="border-{state.error
									? 'error'
									: 'success'} absolute -inset-1 flex items-center justify-center rounded-xl border-2"
							></div>
						{/if}
						<input
							type="text"
							id={`otp-cell-${index}`}
							inputmode="numeric"
							maxlength="1"
							bind:value={state.otpCells[index]}
							oninput={(e) =>
								(state.otpCells[index] = e.currentTarget.value.replace(/[^0-9]/g, ''))}
							onkeydown={(e) => handleInput(index, e.currentTarget.value, e.key)}
							class="input focus:border-primary focus:ring-primary h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold transition-all duration-200 focus:ring-2 focus:outline-none
							"
							disabled={state.isSubmitting}
						/>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex items-center justify-center gap-4">
			<!-- Status Icon -->
			<div
				class="flex h-12 min-w-12 items-center justify-center rounded-lg border-2
					{isComplete() ? (state.error ? 'border-error' : 'border-success-500') : 'border-neutral-content'}
				"
			>
				{#if state.error}
					<div class="absolute" transition:scale={{ duration: 333, easing: elasticInOut }}>
						<Icon icon="mdi:alert-circle" class="text-error h-6 w-6" />
					</div>
				{:else if !isComplete() && !state.isSubmitting}
					<div class="absolute" transition:scale={{ duration: 333, easing: elasticInOut }}>
						<Icon icon="material-symbols:lock-outline" class="h-6 w-6 text-gray-400" />
					</div>
				{:else if isComplete() && !state.isSubmitting}
					<div class="absolute" transition:scale={{ duration: 333, easing: elasticInOut }}>
						<Icon icon="material-symbols:lock-open-rounded" class="h-6 w-6 text-green-600" />
					</div>
				{:else if isComplete() && state.isSubmitting}
					<div class="absolute" transition:scale={{ duration: 333, easing: elasticInOut }}>
						<Icon icon="gg:spinner" class="h-6 w-6 animate-spin" />
					</div>
				{/if}
			</div>
		</div>

		<div class="text-center text-sm opacity-50">
			<p>{m.otp_auth_copy_instructions()}</p>
		</div>
		<div class="flex items-center justify-center gap-4">
			<button class="btn btn-ghost btn-sm" onclick={handleClear}>
				<p>{m.common_clear()}</p>
			</button>
			<button class="btn btn-neutral" onclick={onBackToLogin}>
				<p>{m.otp_auth_back_to_login()}</p>
				<Icon icon="material-symbols:arrow-right-alt-rounded" class="h-4 w-4" />
			</button>
		</div>
	</section>
</main>
