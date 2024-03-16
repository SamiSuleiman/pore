import type { WordPreviewDto } from '$lib/word/model';
import { writable } from 'svelte/store';

export const words = writable<WordPreviewDto[]>([]);
export const error = writable<string | null>(null);
export const loading = writable<boolean>(false);
