<script lang="ts">
	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<div class="@container {className}">
	<div class="relative aspect-square w-full border-2 bg-gray-1 p-[4cqi] text-[7cqi] font-bold">
		Dimension
		<div class="nested-box inset-0 top-1/6 left-1/6 bg-purple-2">
			Dimension relevance
			<div class="nested-box inset-0 top-1/5 left-1/5 bg-purple-3">
				Indicator
				<div
					class="nested-box inset-0 top-1/4 left-1/4 flex items-center justify-center bg-black text-white"
				>
					Question
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference '../../../routes/layout.css';

	.nested-box {
		@apply absolute border-t-2 border-l-2 border-black p-[4cqi];
	}
</style>
