import type { List } from '$lib/models';
import type { TagPreviewDto } from '$lib/tag/model';
import { writable } from 'svelte/store';

export const tags = writable<List<TagPreviewDto>>({ items: [], count: 0 });
export const isOutdated = writable<boolean>(false);
