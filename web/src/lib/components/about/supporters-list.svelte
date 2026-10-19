<script lang="ts">
	const supporters = [
		{
			name: 'Australian Research Council (ARC)',
			detail:
				' Linkage Project (LP250200541), 2026–2029, Project: Guarding Asia’s Democratic Pillars Against Backsliding'
		},
		{
			name: 'Social Science Research Council (SSRC)',
			detail:
				' Abe Fellows Network Collaborative Grant, 2025, Project: Empowering Asian Legislatures: A Transparency Initiative Leveraging Japan’s E-Government Expertise'
		},
		{
			name: 'National Democratic Institute (NDI)',
			detail:
				', Strengthening Parliament Monitoring Efforts in the Asia-Pacific Region (CCW-PMO Network Program), 2024–2025'
		},
		{
			name: 'Taiwan Foundation for Democracy (TFD)',
			detail: ', 2026, Asian Alliance’s Advocacy For Open Parliament In Thailand'
		},
		{
			name: 'Open Society Foundation (OSF)',
			detail:
				', 2026-2029, Advocacy Program: Empowering Parliamentary Openness & Constitutional Dialogue'
		}
	];
</script>

<div>
	<p>We sincerely appreciate every contribution that makes our work possible.</p>
	<ul class="list-disc pl-5">
		{#each supporters as { name, detail } (name)}
			<li><b>{name}</b>{detail}</li>
		{/each}
	</ul>
</div>
