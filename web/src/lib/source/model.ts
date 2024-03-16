import type { WordPreviewDto } from '$lib/word/model';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, isUUID } from 'class-validator';

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

