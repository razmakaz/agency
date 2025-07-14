import { writable } from 'svelte/store';
export const AppState = writable({
	interacted: false,
	fingerprint: undefined as string | undefined
});
