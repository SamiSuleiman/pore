import type { WordPreviewDto } from '$lib/word/model';

export interface SourcePreviewDto {
	id: string;
	type: string;
	content: string;
}

export interface SourceDto extends SourcePreviewDto {
	words: WordPreviewDto[];
}

export interface UpsertSourceDto {
	type: string;
	content: string;
	wordIds: string[];
}
