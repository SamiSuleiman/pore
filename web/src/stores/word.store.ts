import type { WordPreviewDto } from '$lib/word/model';
import { writable } from 'svelte/store';

export const words = writable<WordPreviewDto[]>([]);
export const isOutdated = writable<boolean>(false);
export const isSubmitting = writable<boolean>(false);
