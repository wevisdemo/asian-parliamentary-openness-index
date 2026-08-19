import { fade, slide, type TransitionConfig } from 'svelte/transition';

export const transitionDuration = 150;

export const quickFade = (node: Element): TransitionConfig =>
	fade(node, { duration: transitionDuration });

export const quickSlide = (node: HTMLElement): TransitionConfig =>
	slide(node, { duration: transitionDuration });
