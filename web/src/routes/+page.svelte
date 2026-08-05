<script lang="ts">
	import indexCsv from '$data/index.csv?raw';
</script>

<main class="mx-auto max-w-3xl p-8">
	<h1 class="text-2xl font-bold">Asian Parliamentary Openness Index</h1>
	<p class="mt-2 text-sm text-gray-600">Raw output of <code>data/output/index.csv</code></p>
	<pre class="mt-6 overflow-x-auto rounded bg-gray-100 p-4 text-sm">{indexCsv}</pre>
</main>
