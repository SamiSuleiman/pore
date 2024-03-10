import { TagPreviewDto, TagDto } from 'src/features/tag/tag.dto';
import { Tag } from '../entities/tag.entity';
import { WordMapper } from './word.mapper';

export class TagMapper {
  private constructor() {}

  static toPreview(tag: Tag): TagPreviewDto {
    return {
      id: tag.id,
      title: tag.title,
      color: tag.color,
    };
  }

  static toDto(tag: Tag): TagDto {
    return {
      id: tag.id,
      title: tag.title,
      color: tag.color,
      desc: tag.desc,
      words: tag.words.map((word) => WordMapper.toPreview(word)),
    };
  }
}
