<script lang="ts">
	import { fade } from 'svelte/transition';
	import ArrowUp from 'carbon-icons-svelte/lib/ArrowUp.svelte';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/button.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import TocSidebar from '$lib/components/toc-sidebar.svelte';
	import TruncatableParagraph from '$lib/components/truncatable-paragraph.svelte';
	import { aboutSections } from '$lib/constants/about-sections';
	import { dimensionDescriptions, dimensions } from '$lib/constants/dimensions';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let scrollY = $state(0);

	const scrollToTop = () => window.scrollTo({ top: 0 });

	const audiences = [
		{
			name: 'NGOs & Civil Society',
			description:
				'Plan advocacy activities and prioritize reform efforts using indicator-level evidence.'
		},
		{
			name: 'Parliamentarians & Staff',
			description:
				'Identify where your own parliament falls short and strengthen its openness practices.'
		},
		{
			name: 'Academics & Researchers',
			description:
				'Analyze whether parliamentary openness is associated with corruption, democratic quality, or public trust.'
		},
		{
			name: 'The Press',
			description:
				'Report on transparency gaps to raise public awareness and hold parliaments accountable.'
		}
	];
</script>

<Metadata page="About" />

<Hero
	breadcrumbItems={[
		{ label: 'Home', href: resolve('/') },
		{ label: 'About', href: resolve('/about') }
	]}
	class="bg-gray-1"
>
	<h1 class="h2 font-bold">About</h1>
</Hero>

<section>
	<div class="content-container flex flex-col gap-8 md:flex-row md:gap-16">
		<TocSidebar
			items={aboutSections}
			class="w-full shrink-0 self-start md:sticky md:top-28 md:flex md:w-56"
		/>

		<div class="flex flex-1 flex-col gap-6 md:gap-8">
			<h2 id={aboutSections[0].id}>About the index</h2>

			<p>
				The Asia Parliamentary Openness Index (AAPO) assesses how openly national parliaments across
				the Asia-Pacific region disclose their activities, hold their members accountable, and make
				room for citizens to take part. Every parliament assessed answers the same set of questions,
				scored consistently and rolled up into a single comparable score.
			</p>

			<h3>3 Dimensions</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
				{#each dimensions as dimension (dimension)}
					<div class="flex flex-col gap-3">
						<img
							src="https://placehold.co/600x600/b6c4c7/35393a?text=Illustration"
							alt=""
							class="aspect-square w-full object-cover"
						/>
						<h4 class="b2 font-bold">{dimension}</h4>
						<p>{dimensionDescriptions[dimension]}</p>
					</div>
				{/each}
			</div>

			<h3>Structure</h3>

			<div class="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-6">
				<img
					src="https://placehold.co/600x600/b6c4c7/35393a?text=Illustration"
					alt=""
					class="aspect-square w-full object-cover"
				/>
				<p class="col-span-2">
					Each dimension breaks down into relevances, each relevance into indicators, and each
					indicator into one or more questions — the level at which every chamber is actually
					scored. Scores roll back up the same hierarchy to produce indicator, dimension, and
					overall results.
				</p>
			</div>

			<h3>Who is this for</h3>

			<div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-x-6">
				{#each audiences as { name, description } (name)}
					<div class="flex flex-col gap-3">
						<img
							src="https://placehold.co/600x600/b6c4c7/35393a?text=Illustration"
							alt=""
							class="aspect-square w-full max-w-36 object-cover"
						/>
						<h4 class="b2 font-bold">{name}</h4>
						<p>{description}</p>
					</div>
				{/each}
			</div>

			<h2 id={aboutSections[1].id}>Methodology</h2>

			<h3>Scope and Objectives</h3>

			<TruncatableParagraph>
				Effective democratic governance requires that legislatures operate with meaningful openness
				and accountability to the citizens they represent, yet the extent to which parliaments meet
				these standards often remains difficult to assess in a systematic, comparable manner. The
				Asian Parliamentary Openness Index (APOI) addresses this gap by providing a rigorous,
				evidence-based assessment of parliamentary openness across Asia along three core dimensions:
				access to information, accountability mechanisms, and citizen participation. The Index is
				designed to serve as both a diagnostic instrument and an advocacy tool, enabling
				Parliamentary Monitoring Organizations (PMOs) and other stakeholders to ground reform
				demands in verifiable, cross-nationally comparable evidence.
			</TruncatableParagraph>

			<h3>Methodological Foundations</h3>

			<TruncatableParagraph>
				The APOI indicator framework builds on three established international precedents. The Latin
				American Index for Legislative Transparency (LAILT), administered by the Latin American
				Network for Legislative Transparency, served as the primary methodological reference,
				providing the foundational architecture for APOI's design and demonstrating how a shared
				assessment standard can be constructed across a politically diverse region. The Africa Open
				Parliament Index contributed further insight drawn from the experience of building
				cross-national indicators across African countries with diverse democratic trajectories. The
				Inter-Parliamentary Union's Parline database — covering over 190 national parliaments
				globally — informed both the thematic scope of the indicators and serves as a global
				baseline for contextualising APOI findings. Directorio Legislativo of Argentina was engaged
				as international advisor, providing technical guidance on adapting these frameworks to the
				Asian regional context.
			</TruncatableParagraph>

			<h3>Assessment Framework and Scoring</h3>

			<TruncatableParagraph>
				The APOI framework comprises three dimensions and 31 assessment items. Dimension One —
				Transparency (16 items) — examines the proactive disclosure of meeting agendas, session
				recordings, verbatim transcripts, members' voting records, parliamentary expenditure, and
				the existence of a freedom of information framework. Dimension Two — Accountability (7
				items) — assesses public disclosure of members' assets, conflicts of interest, salaries and
				benefits, and constituency development funds. Dimension Three — Citizen Participation (8
				items) — evaluates formal mechanisms for citizen engagement across the legislative process
				and the physical and digital accessibility of parliamentary resources.
				<br /><br />
				Each item is scored on a three-tier scale: 1 point where a practice is legally mandated and implemented;
				0.5 points where a practice exists through convention or non-binding guidance without legal obligation;
				and 0 points where no mechanism exists. This graduated approach captures meaningful distinctions
				between full, partial, and absent openness, generating actionable diagnoses for reform.
			</TruncatableParagraph>

			<h3>De Facto Assessment Approach</h3>

			<TruncatableParagraph>
				A defining methodological principle of APOI is its focus on de facto practice rather than de
				jure provision. While many legislatures operate within frameworks that nominally guarantee
				transparency, significant gaps frequently exist between formal obligations and actual
				implementation. APOI distinguishes three categories of transparency deficit, each implying a
				distinct reform pathway: where neither legal requirement nor practice exists, foundational
				legislation is required; where provisions exist but are not implemented, the priority is
				enforcement; and where good practice lacks legal backing, entrenchment is needed to
				safeguard against political regression.
			</TruncatableParagraph>

			<h3>Survey Implementation and Dissemination</h3>

			<TruncatableParagraph>
				In each country, the assessment is carried out by local PMOs or independent think tanks,
				with academic experts engaged to verify and validate the findings. All responses are derived
				exclusively from publicly available information. Critically, APOI is not a parliamentary
				self-assessment; it constitutes an independent, external evaluation from a civic standpoint,
				providing an objective appraisal of actual parliamentary openness. The inaugural report is
				scheduled for completion in August 2026 and will be formally launched at an international
				press conference in Bangkok, Thailand in September 2026.
				<br /><br />
				The findings are designed to support peer learning and evidence-based advocacy. Cross-national
				comparison enables parliaments to identify areas of comparative strength for regional knowledge
				exchange, while surfacing clear priorities for reform. AAPO believes that structured, evidence-informed
				dialogue among Asian parliaments transforms the pursuit of openness into a collective regional
				endeavour. Beyond Asia, APOI aspires to serve as a bridge connecting PMOs across Asia, Latin America,
				and Africa — facilitating dialogue and mutual learning among the three regional transparency indices
				and contributing to a broader global movement towards legislatures that are more open, more transparent,
				and more genuinely accountable to the people they serve.
			</TruncatableParagraph>

			<h3>Assessment Cycles</h3>

			<p>Every 2 years, during July–August.</p>

			<div class="flex flex-row items-center gap-2">
				<span class="font-bold">Result:</span>
				<Button size="small" variant="secondary" href={resolve('/insights')}>2026</Button>
			</div>

			<h2 id={aboutSections[2].id}>About contributors</h2>

			<div class="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-6">
				<img
					src="https://placehold.co/600x600/b6c4c7/35393a?text=Illustration"
					alt=""
					class="aspect-square w-full object-cover"
				/>
				<div class="col-span-2 space-y-2">
					<h4 class="b2 font-bold">Asian Alliance for Parliamentary Openness (AAPO)</h4>
					<p>
						Each dimension breaks down into relevances, each relevance into indicators, and each
						indicator into one or more questions — the level at which every chamber is actually
						scored. Scores roll back up the same hierarchy to produce indicator, dimension, and
						overall results.
					</p>
				</div>
			</div>

			<h3>Our team</h3>

			<div class="flex flex-col">
				{#each data.respondents as respondent, index (index)}
					<div
						class="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 border-t border-gray-2 pt-4 pb-6 md:grid-cols-[auto_1fr_auto] md:gap-x-6"
					>
						<img
							src="https://placehold.co/600x600/b6c4c7/35393a?text=Logo"
							alt=""
							class="col-start-1 row-start-1 size-16 object-cover md:size-24"
						/>
						<p class="col-start-2 row-start-1 text-right md:col-start-3">
							{respondent.country}
						</p>
						<div
							class="col-span-2 col-start-1 row-start-2 flex flex-col gap-2 md:col-span-1 md:col-start-2 md:row-start-1"
						>
							<h4 class="b2 font-bold">
								{respondent.organization ?? respondent.names?.join(', ')}
							</h4>
							{#if respondent.about}
								<TruncatableParagraph class="b4 whitespace-pre-line text-gray-8">
									{respondent.about}
								</TruncatableParagraph>
							{/if}
							{#if respondent.email}
								<p>{respondent.email}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	{#if scrollY > 0}
		<div class="sticky bottom-0 z-40 flex justify-center px-5" transition:fade>
			<Button size="small" onclick={scrollToTop}>
				Back to top
				{#snippet icon()}
					<ArrowUp />
				{/snippet}
			</Button>
		</div>
	{/if}
</section>

<svelte:window bind:scrollY />

<style lang="postcss">
	@reference '../layout.css';

	h2 {
		@apply scroll-mt-20 border-t-4 pt-2 h4 font-bold md:pt-4;
	}

	h3 {
		@apply border-t-2 pt-1 b1 font-bold text-gray-8 md:pt-3;
	}
</style>
