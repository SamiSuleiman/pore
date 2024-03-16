import type { WordPreviewDto } from '$lib/word/model';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, isUUID } from 'class-validator';

export class LinkPreviewDto {
	id: string;
	title: string;
}

export class LinkDto extends LinkPreviewDto {
	desc: string;
	words: WordPreviewDto[];
}

export class UpsertLinkDto {
	@IsNotEmpty()
	@MaxLength(60)
	title: string;

	@IsNotEmpty()
	@MaxLength(300)
	desc: string;

	@IsArray()
	@Type(() => isUUID)
	wordIds: string[];
}
