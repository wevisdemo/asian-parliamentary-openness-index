<script lang="ts">
	import { slide } from 'svelte/transition';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte';

	let isVisible = $state(true);
</script>

{#if isVisible}
	<aside
		class="sticky inset-x-0 bottom-0 z-50 bg-black text-white"
		role="note"
		transition:slide={{ duration: 200 }}
	>
		<div class="mx-auto flex max-w-5xl items-start gap-3 px-5 py-3">
			<WarningAltFilled size={24} class="mt-0.5 shrink-0 fill-data-partly-achieved" />

			<div class="flex-1 b5">
				<p class="font-bold">NOTICE: INTERNAL DRAFT — DO NOT DISTRIBUTE</p>
				<p>
					The information on this site is currently under final validation and is subject to change.
					It is not officially released and is intended strictly for internal use. Please refrain
					from sharing or forwarding, and stay tuned for the official announcement.
				</p>
			</div>

			<button
				type="button"
				class="shrink-0 hover:text-purple-1"
				aria-label="Close notice"
				onclick={() => (isVisible = false)}
			>
				<Close size={24} />
			</button>
		</div>
	</aside>
{/if}
