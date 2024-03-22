import type { LinkPreviewDto } from '$lib/link/model';
import type { List } from '$lib/models';
import { writable } from 'svelte/store';

export const links = writable<List<LinkPreviewDto>>({ items: [], count: 0 });
export const isOutdated = writable<boolean>(false);
