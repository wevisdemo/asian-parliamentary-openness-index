<script lang="ts">
	import { fade } from 'svelte/transition';
	import ArrowUp from 'carbon-icons-svelte/lib/ArrowUp.svelte';
	import { resolve } from '$app/paths';
	import AudienceCards from '$lib/components/about/audience-cards.svelte';
	import DimensionCards from '$lib/components/about/dimension-cards.svelte';
	import StructureGraphic from '$lib/components/about/structure-graphic.svelte';
	import RespondentOrganization from '$lib/components/about/respondent-organization.svelte';
	import Button from '$lib/components/button.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Hyperlink from '$lib/components/hyperlink.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import TocSidebar from '$lib/components/toc-sidebar.svelte';
	import TruncatableParagraph from '$lib/components/truncatable-paragraph.svelte';
	import { aboutSections } from '$lib/constants/about-sections';
	import { alliance } from '$lib/constants/contributors';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let scrollY = $state(0);

	const scrollToTop = () => window.scrollTo({ top: 0 });
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
	<div class="content-container flex flex-col gap-8 lg:flex-row lg:gap-16">
		<TocSidebar
			items={aboutSections}
			class="w-full shrink-0 self-start lg:sticky lg:top-28 lg:flex lg:w-56"
		/>

		<div class="flex flex-1 flex-col gap-7.5">
			<h2 id={aboutSections[0].id}>About the index</h2>

			<p>
				Asian Parliamentary Openness Index (APOI) is an assessment tool developed by the Asian
				Alliance for Parliamentary Openness (AAPO), a regional network of parliamentary monitoring
				organizations (PMOs) in Asia-Pacific, to assess their respective parliaments on openness,
				transparency, accountability, and citizen participation.
			</p>

			<p>
				The main objective of the index includes establishing internationally recognised standards
				and providing a benchmark for evaluating Asia-Pacific parliaments’ openness, probing into
				both regional and national gaps, and providing independent, evidence-based assessments from
				a civic standpoint. The index also doubles as an advocacy mechanism for network members to
				push policy reforms based on nationally comparable evidence.
			</p>

			<h3>3 Dimensions</h3>

			<p>The index consists of three main dimensions for thematic assessment.</p>

			<DimensionCards detailed />

			<h3>Index Structure</h3>

			<div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
				<StructureGraphic />
				<p class="lg:col-span-2">
					Each dimension breaks down into relevances, each relevance into indicators, and each
					indicator into one or more questions — the level at which every chamber is actually
					scored. Scores roll back up the same hierarchy to produce indicator, dimension, and
					overall results.
				</p>
			</div>

			<h3>Who is this for</h3>

			<AudienceCards />

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
				The APOI indicator framework builds on three established international precedents. The
				<Hyperlink color="gray" href="https://latinno.net/en/case/4116/" target="_blank">
					Latin American Index for Legislative Transparency (LAILT)
				</Hyperlink>, administered by the Latin American Network for Legislative Transparency,
				served as the primary methodological reference, providing the foundational architecture for
				APOI's design and demonstrating how a shared assessment standard can be constructed across a
				politically diverse region. The
				<Hyperlink color="gray" href="https://parliamentafrica.com/opi/" target="_blank">
					Africa Open Parliament Index
				</Hyperlink>
				contributed further insight drawn from the experience of building cross-national indicators across
				African countries with diverse democratic trajectories. The Inter-Parliamentary Union's
				<Hyperlink color="gray" href="https://data.ipu.org/" target="_blank"
					>Parline database</Hyperlink
				> — covering over 190 national parliaments globally — informed both the thematic scope of the
				indicators and serves as a global baseline for contextualising APOI findings. Directorio Legislativo
				of Argentina was engaged as international advisor, providing technical guidance on adapting these
				frameworks to the Asian regional context.
			</TruncatableParagraph>

			<h3>Indicator Co-Construction Process</h3>

			<TruncatableParagraph>
				APOI's indicators were developed through a participatory co-construction process. Beginning
				in November 2024, member organisations engaged in structured monthly online deliberations
				over nearly one year, submitting written inputs in advance of each session via a
				standardised online form. Each meeting was dedicated to one dimension of the framework. In
				September 2025, members convened in Tokyo, Japan for an in-person consensus workshop to
				complete the first draft of the indicator set. Subsequent monthly meetings refined the
				indicator language and questionnaire design, with the framework formally finalised in June
				2026.
			</TruncatableParagraph>

			<h3>Assessment Framework and Scoring</h3>

			<TruncatableParagraph>
				The APOI framework comprises three dimensions and {data.indicatorCount} assessment items. Dimension
				One — Transparency ({data.indicatorCountByDimension.Transparency} items) — examines the proactive
				disclosure of meeting agendas, session recordings, verbatim transcripts, members' voting records,
				MP salaries and allowances, draft bills, budget documents, parliamentary expenditure, and the
				existence of a freedom of information framework. Dimension Two — Accountability ({data
					.indicatorCountByDimension.Accountability} items) — assesses public disclosure of members' assets,
				conflicts of interest, pre- and post-legislative scrutiny of laws, and formal channels for tracking
				public queries. Dimension Three — Citizen Participation ({data.indicatorCountByDimension[
					'Citizen Participation'
				]} items) — evaluates formal mechanisms for citizen engagement across the legislative process
				and the physical and digital accessibility of parliamentary resources.
				<br /><br />
				Each item is scored on a scale from 0 to 1. A score of 1 is awarded where an item's requirements
				are fully met; a score of 0 where they are not met at all; and an intermediate score between 0
				and 1 where requirements are only partially fulfilled. Certain items may include response options
				that do not apply to a given country's context; in such cases, the item is excluded from calculation
				and marked as "N/A." This graduated approach captures meaningful distinctions across the full
				range of openness, generating actionable diagnoses for reform.
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
				providing an objective appraisal of actual parliamentary openness.
				<br /><br />
				Findings are published in an inaugural report, first launched at an international press conference
				in Bangkok, Thailand in 2026, with subsequent editions released on a regular cycle, designed to
				support peer learning and evidence-based advocacy. Cross-national comparison enables parliaments
				to identify areas of comparative strength for regional knowledge exchange, while surfacing clear
				priorities for reform. AAPO believes that structured, evidence-informed dialogue among Asian parliaments
				transforms the pursuit of openness into a collective regional endeavour. Beyond Asia, APOI aspires
				to serve as a bridge connecting PMOs across Asia, Latin America, and Africa — facilitating dialogue
				and mutual learning among the three regional transparency indices and contributing to a broader
				global movement towards legislatures that are more open, more transparent, and more genuinely
				accountable to the people they serve.
			</TruncatableParagraph>

			<h3>Assessment Cycles</h3>

			<p>Every 2 years, during July–August.</p>

			<div class="flex flex-row items-center gap-2">
				<span class="font-bold">Result:</span>
				<Button size="small" variant="secondary" href={resolve('/insights')}>2026</Button>
			</div>

			<h2 id={aboutSections[2].id}>About contributors</h2>

			<div class="flex flex-col gap-4 md:flex-row md:gap-8">
				<img src={alliance.logo} alt="" class="w-full max-w-40 self-start object-contain" />
				<div class="flex-1 space-y-2">
					<h4 class="b2 font-bold">{alliance.name}</h4>
					<p>{alliance.description}</p>
				</div>
			</div>

			<TruncatableParagraph>
				Beyond monitoring, we actively promote <b>civic participation</b>, encouraging citizens to
				engage with parliamentary processes and contribute to democratic governance. By fostering
				dialogue between the public, parliaments, and legislators, we aim to bridge the gap between
				institutions and society.
				<br /><br />
				Our initiatives include regional transparency surveys, civic tech tools, public campaigns, and
				capacity-building efforts—all designed to make parliaments more accessible and understandable
				to the people. We believe that an open parliament, shaped by both institutional cooperation and
				active public involvement, is key to building public trust and strengthening democracy across
				Asia.
			</TruncatableParagraph>

			<h3>Our team</h3>

			<p>
				Our members bring diverse strengths, including expertise in parliament monitoring, civic
				technology, data visualization, and public policy advocacy. Through these combined skills,
				we work collectively to push for more open and accountable legislative bodies.
			</p>

			<div class="flex flex-col">
				{#each data.respondents as respondent, index (index)}
					<RespondentOrganization {respondent} />
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
		@apply scroll-mt-20 border-t-4 pt-2 h4 font-bold lg:pt-4;

		&:not(:first-child) {
			@apply mt-7.5;
		}
	}

	h3 {
		@apply border-t border-gray-6 pt-1 b1 font-bold text-gray-8 lg:pt-3;
	}
</style>
