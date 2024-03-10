import { WordDto, WordPreviewDto } from '../../features/word/word.dto';
import { Word } from '../entities/word.entity';
import { DefinitionMapper } from './definition.mapper';
import { ExampleMapper } from './example.mapper';
import { LinkMapper } from './link.mapper';
import { SourceMapper } from './source.mapper';
import { TagMapper } from './tag.mapper';

export class WordMapper {
  private constructor() {}

  static toPreview(word: Word): WordPreviewDto {
    return {
      id: word.id,
      content: word.content,
      tags: word.tags.map((tag) => TagMapper.toPreview(tag)),
      links: word.links.map((link) => LinkMapper.toPreview(link)),
      source: word.source ? SourceMapper.toPreview(word.source) : undefined,
      language: word.language,
    };
  }

  static toDto(word: Word): WordDto {
    return {
      id: word.id,
      content: word.content,
      definitions: word.definitions.map((definition) =>
        DefinitionMapper.toDto(definition),
      ),
      examples: word.examples.map((example) => ExampleMapper.toDto(example)),
      tags: word.tags.map((tag) => TagMapper.toPreview(tag)),
      links: word.links.map((link) => LinkMapper.toPreview(link)),
      source: word.source ? SourceMapper.toPreview(word.source) : undefined,
      language: word.language,
    };
  }
}
