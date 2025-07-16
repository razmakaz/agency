export type ToastOptions = {
	title: string;
	message?: string;
	type?: ToastType;
	duration?: number;
	icon?: string;
	closable?: boolean;
};

export type ToastType = 'primary' | 'secondary ' | 'success' | 'error' | 'info' | 'warning';
