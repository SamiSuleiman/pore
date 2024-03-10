import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, isUUID } from 'class-validator';
import { WordPreviewDto } from '../word/word.dto';

export class SourcePreviewDto {
  id: string;
  type: string;
  content: string;
}

export class SourceDto extends SourcePreviewDto {
  words: WordPreviewDto[];
}

export class UpsertSourceDto {
  @IsNotEmpty()
  @MaxLength(60)
  type: string;

  @IsNotEmpty()
  @MaxLength(180)
  content: string;

  @IsArray()
  @Type(() => isUUID)
  wordIds: string[];
}

export const sourceTypes = ['book', 'article', 'video', 'podcast'] as const;
export type SourceType = (typeof sourceTypes)[number];
