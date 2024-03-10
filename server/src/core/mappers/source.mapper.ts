import { SourceDto, SourcePreviewDto } from 'src/features/source/source.dto';
import { Source } from '../entities/source.entity';
import { WordMapper } from './word.mapper';

export class SourceMapper {
  private constructor() {}

  static toPreview(source: Source): SourcePreviewDto {
    return {
      id: source.id,
      type: source.type,
      content: source.content ?? '',
    };
  }

  static toDto(source: Source): SourceDto {
    return {
      id: source.id,
      type: source.type,
      content: source.content ?? '',
      words: source.words.map((word) => WordMapper.toPreview(word)),
    };
  }
}
