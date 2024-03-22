import type { List } from '$lib/models';
import type { SourcePreviewDto } from '$lib/source/model';
import { writable } from 'svelte/store';

export const sources = writable<List<SourcePreviewDto>>({ items: [], count: 0 });
export const isOutdated = writable<boolean>(false);
