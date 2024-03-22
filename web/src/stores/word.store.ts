import type { List } from '$lib/models';
import type { WordPreviewDto } from '$lib/word/model';
import { writable } from 'svelte/store';

export const words = writable<List<WordPreviewDto>>({ items: [], count: 0 });
export const isOutdated = writable<boolean>(false);
export const isSubmitting = writable<boolean>(false);
