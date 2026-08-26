<script lang="ts">
	interface Props {
		scores: { name: string; score: number }[];
		average?: number;
		class?: string;
	}

	const { scores, average, class: className }: Props = $props();

	const ticks = [100, 75, 50, 25, 0];
</script>

<div class={['flex flex-row gap-px font-mono b5 text-gray-6', className]}>
	<div class="flex flex-col items-end justify-between text-right leading-none">
		{#each ticks as tick (tick)}
			<div class="relative ml-[3ch] h-px w-1 bg-gray-6">
				<span
					class={[
						'absolute right-1.5',
						tick === 100 ? 'top-0' : tick === 0 ? 'bottom-0' : '-translate-y-1/2'
					]}>{tick}</span
				>
			</div>
		{/each}
	</div>

	<div class="relative flex flex-1 flex-row items-end gap-0.5">
		{#each scores as { name, score } (name)}
			<div class="relative h-full flex-1 bg-gray-10">
				<div class="absolute inset-x-0 bottom-0 bg-white" style="height: {score}%">
					<span class="sr-only">{name}: {score.toFixed(2)}%</span>
				</div>
			</div>
		{/each}

		{#if average !== undefined}
			<div
				class="absolute inset-x-0 translate-y-px border-t-2 border-dashed border-purple-2"
				style="bottom: {average}%"
			></div>
		{/if}
	</div>
</div>
