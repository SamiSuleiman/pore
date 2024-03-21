import type { WordPreviewDto } from '$lib/word/model';

export interface TagPreviewDto {
	id: string;
	title: string;
}

export interface TagDto extends TagPreviewDto {
	desc: string;
	words: WordPreviewDto[];
}

export interface UpsertTagDto {
	title: string;
	desc: string;
	wordIds: string[];
}
