import { DefinitionDto } from 'src/features/word/definition.dto';
import { Definition } from '../entities/definition.entity';

export class DefinitionMapper {
  static toDto(link: Definition): DefinitionDto {
    return {
      id: link.id,
      content: link.content,
    };
  }
}
