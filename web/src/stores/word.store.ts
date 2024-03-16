import type { WordPreviewDto } from '$lib/word/model';
import { writable } from 'svelte/store';

export const words = writable<WordPreviewDto[]>([]);
