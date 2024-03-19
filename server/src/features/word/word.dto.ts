import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  isUUID,
} from 'class-validator';
import { LinkDto, LinkPreviewDto } from '../link/link.dto';
import { SourcePreviewDto } from '../source/source.dto';
import { TagPreviewDto } from '../tag/tag.dto';
import { DefinitionDto } from './definition.dto';
import { ExampleDto } from './example.dto';

export class WordPreviewDto {
  id: string;
  content: string;
  tags: TagPreviewDto[];
  links: LinkPreviewDto[];
  source?: SourcePreviewDto;
  language: string;
}

export class WordDto extends WordPreviewDto {
  definitions: DefinitionDto[];
  examples: ExampleDto[];
  links: LinkDto[];
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
