import { writable } from 'svelte/store';
export const AppState = writable({
	navEnabled: false,
	navExpanded: false,
	session: null as any | null
});
