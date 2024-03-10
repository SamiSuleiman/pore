import { ExampleDto } from 'src/features/word/example.dto';
import { Example } from '../entities/example.entity';

export class ExampleMapper {
  private constructor() {}

  static toDto(link: Example): ExampleDto {
    return {
      id: link.id,
      content: link.content,
    };
  }
}
