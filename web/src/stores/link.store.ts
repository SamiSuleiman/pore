import type { LinkPreviewDto } from '$lib/link/model';
import { writable } from 'svelte/store';

export const links = writable<LinkPreviewDto[]>([]);
export const isOutdated = writable<boolean>(false);
