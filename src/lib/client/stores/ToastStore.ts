import type { ToastOptions } from '$lib/@types/ToastOptions';
import { writable } from 'svelte/store';

export type ToastType = 'primary' | 'secondary ' | 'success' | 'error' | 'info' | 'warning';

export const ToastStore = writable<
	{
		id: string;
		icon: string;
		title: string;
		message: string;
		type: ToastType;
		duration: number;
		createdAt: number;
		closable: boolean;
	}[]
>([]);

export const addToast = ({
	title,
	message = '',
	type = 'success',
	duration = 3000,
	icon = '',
	closable = true
}: ToastOptions) => {
	ToastStore.update((state) => [
		...state,
		{
			id: crypto.randomUUID(),
			title,
			message,
			type,
			duration,
			createdAt: Date.now(),
			icon,
			closable
		}
	]);
};

export const addErrorToast = ({
	title = 'Error',
	message = '',
	duration = 5000,
	icon = 'carbon:error-filled',
	closable = true
}: ToastOptions) => {
	addToast({
		title,
		message,
		type: 'error',
		duration,
		icon,
		closable
	});
};

export const addSuccessToast = ({
	title = 'Success',
	message = '',
	duration = 3000,
	icon = 'streamline-sharp:check-solid',
	closable = true
}: ToastOptions) => {
	addToast({
		title,
		message,
		type: 'success',
		duration,
		icon,
		closable
	});
};

export const removeToast = (id: string) => {
	ToastStore.update((state) => state.filter((toast) => toast.id !== id));
};

export const removeToastByIndex = (index: number) => {
	ToastStore.update((state) => state.filter((_, i) => i !== index));
};
