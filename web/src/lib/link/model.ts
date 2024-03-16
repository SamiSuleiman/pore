import type { WordPreviewDto } from '$lib/word/model';

export interface LinkPreviewDto {
	id: string;
	title: string;
}

export interface LinkDto extends LinkPreviewDto {
	desc: string;
	words: WordPreviewDto[];
}

export interface UpsertLinkDto {
	title: string;
	desc: string;
	wordIds: string[];
}
