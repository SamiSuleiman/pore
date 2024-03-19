import type { TagPreviewDto } from '$lib/tag/model';
import { writable } from 'svelte/store';

export const tags = writable<TagPreviewDto[]>([]);
export const isOutdated = writable<boolean>(false);
