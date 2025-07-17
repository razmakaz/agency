<script lang="ts">
	import { onMount } from 'svelte';

	type ElementArray = { type: string; name: string; value: string };

	const { children, schema } = $props();

	let formState = $state({
		elements: [] as ElementArray[]
	});

	const init = async () => {
		// To add more elements, just add them to the type then add them to the collectElements function
		type AllowedElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
		const collectElements = <T extends AllowedElements>(tag: string, type: string) =>
			Array.from(document.getElementsByTagName(tag) as HTMLCollectionOf<T>).map((el) => ({
				type,
				name: (el as T).name,
				value: (el as T).value
			}));

		formState.elements = [
			...collectElements<HTMLInputElement>('input', 'input'),
			...collectElements<HTMLSelectElement>('select', 'select'),
			...collectElements<HTMLTextAreaElement>('textarea', 'textarea')
		];

		console.log({ formState });
	};

	onMount(() => {
		init();
	});
</script>

<div class="">
	{@render children(formState)}
</div>
