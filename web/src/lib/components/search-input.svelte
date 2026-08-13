<script lang="ts">
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';

	interface Props {
		value: string;
		placeholder?: string;
		class?: string;
	}

	let { value = $bindable(), placeholder = 'Search', class: className }: Props = $props();
</script>

<label class={['relative flex items-center text-purple-5', className]}>
	<Search size={16} class="pointer-events-none absolute left-4" />
	<input
		type="search"
		bind:value
		{placeholder}
		class={[
			'w-full border border-purple-5 px-10 py-2.5 text-gray-8 transition-colors placeholder:text-purple-5 focus:outline-purple-5',
			value && 'bg-purple-1'
		]}
	/>
	{#if value}
		<button
			type="button"
			aria-label="Clear search"
			onclick={() => (value = '')}
			class="absolute right-3 cursor-pointer"
		>
			<Close size={20} />
		</button>
	{/if}
</label>

<style>
	input[type='search']::-webkit-search-cancel-button {
		-webkit-appearance: none;
		appearance: none;
	}
</style>
