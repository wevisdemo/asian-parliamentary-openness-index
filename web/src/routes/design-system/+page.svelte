<script lang="ts">
	const headings = [
		{ name: 'H1', class: 'h1', size: '48 / 80' },
		{ name: 'H2', class: 'h2', size: '36 / 60' },
		{ name: 'H3', class: 'h3', size: '32 / 48' },
		{ name: 'H4', class: 'h4', size: '28 / 36' },
		{ name: 'H5', class: 'h5', size: '24 / 32' }
	];

	const bodies = [
		{ name: 'B1', class: 'b1', size: '21 / 24' },
		{ name: 'B2', class: 'b2', size: '18 / 21' },
		{ name: 'B3', class: 'b3', size: '16 / 18' },
		{ name: 'B4', class: 'b4', size: '14 / 16' },
		{ name: 'B5', class: 'b5', size: '12 / 14' }
	];

	const swatchGroups = [
		{
			title: 'Base',
			swatches: [
				{ name: 'black', class: 'bg-black', hex: '#191919' },
				{ name: 'white', class: 'bg-white', hex: '#FCFCFC' }
			]
		},
		{
			title: 'Gray',
			swatches: [
				{ name: 'gray-1', class: 'bg-gray-1', hex: '#EDF2F3' },
				{ name: 'gray-2', class: 'bg-gray-2', hex: '#CED9DB' },
				{ name: 'gray-3', class: 'bg-gray-3', hex: '#B6C4C7' },
				{ name: 'gray-4', class: 'bg-gray-4', hex: '#A5B4B7' },
				{ name: 'gray-5', class: 'bg-gray-5', hex: '#919FA2' },
				{ name: 'gray-6', class: 'bg-gray-6', hex: '#859194' },
				{ name: 'gray-7', class: 'bg-gray-7', hex: '#6E7779' },
				{ name: 'gray-8', class: 'bg-gray-8', hex: '#5F6769' },
				{ name: 'gray-9', class: 'bg-gray-9', hex: '#4C5153' },
				{ name: 'gray-10', class: 'bg-gray-10', hex: '#35393A' }
			]
		},
		{
			title: 'Purple',
			swatches: [
				{ name: 'purple-1', class: 'bg-purple-1', hex: '#D1DAFF' },
				{ name: 'purple-2', class: 'bg-purple-2', hex: '#BFC7FF' },
				{ name: 'purple-3', class: 'bg-purple-3', hex: '#948DF2' },
				{ name: 'purple-4', class: 'bg-purple-4', hex: '#7256DF' },
				{ name: 'purple-5', class: 'bg-purple-5', hex: '#5437CC' }
			]
		},
		{
			title: 'Data status',
			swatches: [
				{ name: 'data-achieved', class: 'bg-data-achieved', hex: '#00BDDA' },
				{ name: 'data-partly-achieved', class: 'bg-data-partly-achieved', hex: '#FCFF9F' },
				{ name: 'data-not-achieved', class: 'bg-data-not-achieved', hex: '#FF5335' },
				{ name: 'data-na', class: 'bg-data-na', hex: '#CECECE' }
			]
		}
	];
</script>

<svelte:head>
	<title>Design System · Asian Parliamentary Openness Index</title>
</svelte:head>

<main class="mx-auto max-w-5xl bg-white px-6 py-16">
	<header class="mb-16">
		<h1 class="h2 font-bold">Design System</h1>
		<p class="mt-2 text-gray-8">Asian Parliamentary Openness Index</p>
	</header>

	<section class="mb-16">
		<h2 class="mb-6 h4 font-bold">Headings</h2>
		<div class="divide-y divide-gray-2 border-y border-gray-2">
			{#each headings as { name, class: className, size } (name)}
				<div class="flex flex-col gap-2 py-6 md:flex-row md:gap-8">
					<div class="w-40 shrink-0">
						<p class="b5 font-bold">{name}</p>
						<p class="font-mono b5 text-purple-4">{size}px · 125%</p>
					</div>
					<div class="min-w-0">
						<p class={[className, 'font-bold']}>Spline Sans-Bold</p>
						<p class={className}>Spline Sans-Regular</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="mb-16">
		<h2 class="mb-6 h4 font-bold">Body</h2>
		<div class="divide-y divide-gray-2 border-y border-gray-2">
			{#each bodies as { name, class: className, size } (name)}
				<div class="flex flex-col gap-2 py-6 md:flex-row md:gap-8">
					<div class="w-40 shrink-0">
						<p class="b5 font-bold">{name}</p>
						<p class="font-mono b5 text-purple-4">{size}px · 140%</p>
					</div>
					<div class="min-w-0">
						<p class={[className, 'font-bold']}>Spline Sans-Bold</p>
						<p class={className}>Spline Sans-Regular</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-6 h4 font-bold">Colors</h2>
		{#each swatchGroups as { title, swatches } (title)}
			<h3 class="mt-8 mb-3 font-bold text-gray-8">{title}</h3>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
				{#each swatches as { name, class: className, hex } (name)}
					<div>
						<div class={[className, 'h-20 rounded border border-gray-3']}></div>
						<p class="mt-2 b5 font-bold">{name}</p>
						<p class="b5 text-gray-7">{hex}</p>
					</div>
				{/each}
			</div>
		{/each}
	</section>
</main>
