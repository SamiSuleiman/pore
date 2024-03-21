import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, isUUID } from 'class-validator';
import { WordPreviewDto } from '../word/word.dto';

export interface LinkPreviewDto {
  id: string;
  title: string;
  wordContents: string[];
}

export interface LinkDto extends Omit<LinkPreviewDto, 'wordContents'> {
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

export const linkTypes = ['translation', 'synonyms', 'antonyms'] as const;
export type LinkType = (typeof linkTypes)[number];
