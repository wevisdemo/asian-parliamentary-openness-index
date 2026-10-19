<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { feedbackFormUrl } from '$lib/constants/feedback';
	import AcademicContact from './academic-contact.svelte';
	import MoreActionCard from './more-action-card.svelte';

	interface ActionLink {
		label: string;
		href: string;
	}

	interface Props {
		title?: string;
		description?: string;
		actions?: ActionLink[];
		children?: Snippet;
	}

	const {
		title = 'Conduct deeper analysis',
		description = 'Machine-readable data for all countries in this cycle is available for download.',
		actions = [{ label: 'Download raw data', href: resolve('/downloads') }],
		children = academicContact
	}: Props = $props();
</script>

{#snippet academicContact()}
	<AcademicContact class="b4 text-gray-8" />
{/snippet}

<div class="flex flex-col gap-4">
	<MoreActionCard {title} {description} {actions} {children} />
	<MoreActionCard
		variant="gray"
		title="Submit your feedback"
		description="If you have concerns about a country’s score, suggestions for improving the index, or feedback on the website experience, you can submit feedback. Your input will be reviewed and shared with the team best placed to address it."
		actions={[{ label: 'Feedback form', href: feedbackFormUrl, target: '_blank' }]}
	/>
</div>
