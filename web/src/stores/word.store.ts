import type { WordDto, WordPreviewDto } from '$lib/word/model';
import { writable } from 'svelte/store';

export const words = writable<WordPreviewDto[]>([]);
export const hasError = writable<string | null>(null);
export const isLoading = writable<boolean>(false);
export const isOpen = writable<boolean>(false);
export const isUpsertMode = writable<boolean>(false);
export const selectedWord = writable<WordDto | null>(null);
