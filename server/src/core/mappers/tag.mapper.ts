import { TagPreviewDto, TagDto } from 'src/features/tag/tag.dto';
import { Tag } from '../entities/tag.entity';
import { WordMapper } from './word.mapper';

export class TagMapper {
  private constructor() {}

  static toPreview(tag: Tag): TagPreviewDto {
    return {
      id: tag.id,
      title: tag.title,
    };
  }

  static toDto(tag: Tag): TagDto {
    return {
      id: tag.id,
      title: tag.title,
      desc: tag.desc,
      words: tag.words.map((word) => WordMapper.toPreview(word)),
    };
  }
}
