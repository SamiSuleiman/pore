import { LinkPreviewDto, LinkDto } from 'src/features/link/link.dto';
import { Link } from '../entities/link.entity';
import { WordMapper } from './word.mapper';

export class LinkMapper {
  static toPreview(link: Link): LinkPreviewDto {
    return {
      id: link.id,
      title: link.title,
      wordContents: link.words.map((word) => word.content),
    };
  }

  static toDto(link: Link): LinkDto {
    return {
      id: link.id,
      title: link.title,
      desc: link.desc,
      words: link.words.map((word) => WordMapper.toPreview(word)),
    };
  }
}
