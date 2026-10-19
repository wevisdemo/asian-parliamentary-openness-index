<script lang="ts">
	import Hyperlink from './hyperlink.svelte';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<p class={className}>
	For academic use, please contact Professor Akihiro Ogawa (Email:
	<Hyperlink href="mailto:akihiro.ogawa@unimelb.edu.au">akihiro.ogawa@unimelb.edu.au</Hyperlink>)
</p>
