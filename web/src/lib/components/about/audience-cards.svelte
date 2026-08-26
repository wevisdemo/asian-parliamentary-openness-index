<script lang="ts">
	import academicsImage from '$lib/assets/images/about/audience-academics.svg';
	import ngoImage from '$lib/assets/images/about/audience-ngo.svg';
	import parliamentImage from '$lib/assets/images/about/audience-parliament.svg';
	import pressImage from '$lib/assets/images/about/audience-press.svg';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const audiences = [
		{
			name: 'NGOs & Civil Society',
			description:
				'Plan advocacy activities and prioritize reform efforts using indicator-level evidence.',
			image: ngoImage
		},
		{
			name: 'Parliamentarians & Staff',
			description:
				'Identify where your own parliament falls short and strengthen its openness practices.',
			image: parliamentImage
		},
		{
			name: 'Academics & Researchers',
			description:
				'Analyze whether parliamentary openness is associated with corruption, democratic quality, or public trust.',
			image: academicsImage
		},
		{
			name: 'The Press',
			description:
				'Report on transparency gaps to raise public awareness and hold parliaments accountable.',
			image: pressImage
		}
	];
</script>

<div class={['grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-x-6', className]}>
	{#each audiences as { name, description, image } (name)}
		<div class="flex flex-col gap-3">
			<img src={image} alt="" class="aspect-square w-full max-w-30 object-contain" />
			<h4 class="b2 font-bold">{name}</h4>
			<p>{description}</p>
		</div>
	{/each}
</div>
