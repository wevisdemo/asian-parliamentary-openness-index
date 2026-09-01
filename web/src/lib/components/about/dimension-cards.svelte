<script lang="ts">
	import accountabilityImage from '$lib/assets/images/about/dimension-accountability.svg';
	import civicParticipationImage from '$lib/assets/images/about/dimension-civic-participation.svg';
	import transparencyImage from '$lib/assets/images/about/dimension-transparency.svg';
	import {
		dimensionDescriptions,
		dimensionDetailedDescriptions,
		dimensions,
		type Dimension
	} from '$lib/constants/dimensions';

	interface Props {
		detailed?: boolean;
		class?: string;
	}

	const { detailed = false, class: className }: Props = $props();

	const dimensionImages: Record<Dimension, string> = {
		Transparency: transparencyImage,
		Accountability: accountabilityImage,
		'Citizen Participation': civicParticipationImage
	};
</script>

<div class={['grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3', className]}>
	{#each dimensions as dimension (dimension)}
		<div class="flex flex-col gap-3">
			<img src={dimensionImages[dimension]} alt="" class="aspect-square w-full object-contain" />
			<h4 class="b2 font-bold">{dimension}</h4>
			<p>
				{detailed ? dimensionDetailedDescriptions[dimension] : dimensionDescriptions[dimension]}
			</p>
		</div>
	{/each}
</div>
