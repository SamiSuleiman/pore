import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, isUUID } from 'class-validator';
import { LinkDto, LinkPreviewDto } from '../link/link.dto';
import { SourcePreviewDto } from '../source/source.dto';
import { TagPreviewDto } from '../tag/tag.dto';
import { DefinitionDto } from './definition.dto';
import { ExampleDto } from './example.dto';

export interface WordPreviewDto {
  id: string;
  content: string;
  tags: TagPreviewDto[];
  links: LinkPreviewDto[];
  source?: SourcePreviewDto;
  language: string;
}

export interface WordDto extends Omit<WordPreviewDto, 'links'> {
  definitions: DefinitionDto[];
  examples: ExampleDto[];
  links: LinkDto[];
}

export class UpsertWordDto {
  @IsNotEmpty()
  @MaxLength(60)
  content: string;

  @IsArray()
  @Type(() => isUUID)
  tagIds: string[];

  @IsArray()
  @Type(() => isUUID)
  linkIds: string[];

  sourceId?: string;

  @IsNotEmpty()
  @MaxLength(9)
  language: string;

  @IsArray()
  @Type(() => String)
  definitions: string[];

  @IsArray()
  @Type(() => String)
  examples: string[];
}
