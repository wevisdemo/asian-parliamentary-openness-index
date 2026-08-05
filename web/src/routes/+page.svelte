<script lang="ts">
	import { resolve } from '$app/paths';
	import indexCsv from '$data/index.csv?raw';
</script>

<main class="mx-auto max-w-5xl px-6 py-16">
	<h1 class="h3 font-bold">Asian Parliamentary Openness Index</h1>
	<p class="mt-2 b4 text-gray-8">
		Raw output of <code>data/output/index.csv</code>
	</p>
	<a href={resolve('/design-system')} class="mt-4 inline-block b4 text-purple-5 underline">
		Design system
	</a>
	<pre class="mt-6 overflow-x-auto rounded bg-gray-1 p-4 b5">{indexCsv}</pre>
</main>
