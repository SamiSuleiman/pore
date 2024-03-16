import { IsArray, IsUUID, MaxLength, isUUID, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import type { LinkPreviewDto } from '$lib/link/model';
import type { SourcePreviewDto } from '$lib/source/model';
import type { TagPreviewDto } from '$lib/tag/model';

export interface WordPreviewDto {
	id: string;
	content: string;
	tags: TagPreviewDto[];
	links: LinkPreviewDto[];
	source?: SourcePreviewDto;
	language: string;
}

export interface WordDto extends WordPreviewDto {
	definitions: DefinitionDto[];
	examples: ExampleDto[];
}

export class UpdateWordDto {
	@IsNotEmpty()
	@MaxLength(60)
	content: string;

	@IsArray()
	@Type(() => isUUID)
	tagIds: string[];

	@IsArray()
	@Type(() => isUUID)
	linkIds: string[];

	@IsUUID()
	sourceId?: string;

	@IsNotEmpty()
	@MaxLength(9)
	language: string;
}

export class AddWordDto extends UpdateWordDto {
	@IsArray()
	@Type(() => String)
	definitions: string[];

	@IsArray()
	@Type(() => String)
	examples: string[];
}

export class DefinitionDto {
	id: string;
	content: string;
}

export class UpsertDefinitionDto {
	@IsNotEmpty()
	@MaxLength(210)
	content: string;
}

export class ExampleDto {
	id: string;
	content: string;
}

export class UpsertExampleDto {
	@IsNotEmpty()
	@MaxLength(210)
	content: string;
}
