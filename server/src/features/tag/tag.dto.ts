import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, isUUID } from 'class-validator';
import { WordPreviewDto } from '../word/word.dto';

export class TagPreviewDto {
  id: string;
  title: string;
  color: string;
}

export class TagDto extends TagPreviewDto {
  desc: string;
  words: WordPreviewDto[];
}

export class UpsertTagDto {
  @IsNotEmpty()
  @MaxLength(60)
  title: string;

  @IsNotEmpty()
  @MaxLength(180)
  desc: string;

  @IsNotEmpty()
  @MaxLength(20)
  color: string;

  @IsArray()
  @Type(() => isUUID)
  wordIds: string[];
}
