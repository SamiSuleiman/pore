import type { LinkDto, LinkPreviewDto } from '$lib/link/model';
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
	links: LinkDto[];
}

export interface UpdateWordDto {
	content: string;
	tagIds: string[];
	linkIds: string[];
	sourceId?: string;
	language: string;
}

export interface AddWordDto extends UpdateWordDto {
	definitions: string[];
	examples: string[];
}

export interface DefinitionDto {
	id: string;
	content: string;
}

export interface UpsertDefinitionDto {
	content: string;
}

export interface ExampleDto {
	id: string;
	content: string;
}

export interface UpsertExampleDto {
	content: string;
}
