<script lang="ts">
	const { children, ready } = $props();
</script>

<div class="relative">
	<h1
		class="from-primary to-secondary inline-block bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent"
	>
		{@render children()}
	</h1>

	<div
		class="from-primary to-secondary absolute bottom-1 h-px bg-gradient-to-r transition-all duration-1000 {ready
			? '-inset-x-0 opacity-100'
			: 'inset-x-16 opacity-0'}"
	></div>
</div>
