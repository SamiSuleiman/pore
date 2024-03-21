import type { WordPreviewDto } from '$lib/word/model';

export interface LinkPreviewDto {
	id: string;
	title: string;
	wordContents: string[];
}

export interface LinkDto extends Omit<LinkPreviewDto, 'wordContents'> {
	desc: string;
	words: WordPreviewDto[];
}

export interface UpsertLinkDto {
	title: string;
	desc: string;
	wordIds: string[];
}
