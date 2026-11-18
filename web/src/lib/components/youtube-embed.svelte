<script lang="ts">
	const { id, title }: { id: string; title: string } = $props();
</script>

<iframe
	src="https://www.youtube-nocookie.com/embed/{id}"
	{title}
	loading="lazy"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen
	referrerpolicy="strict-origin-when-cross-origin"
	class="aspect-video w-full rounded"
></iframe>
