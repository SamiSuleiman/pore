import { Module } from '@nestjs/common';
import { Definition } from 'src/core/entities/definition.entity';
import { Example } from 'src/core/entities/example.entity';
import { Link } from 'src/core/entities/link.entity';
import { Source } from 'src/core/entities/source.entity';
import { Tag } from 'src/core/entities/tag.entity';
import { Word } from 'src/core/entities/word.entity';
import { DataModule } from 'src/data/data.module';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { DefinitionController } from './definition/definition.controller';
import { DefinitionService } from './definition/definition.service';
import { ExampleController } from './example/example.controller';
import { ExampleService } from './example/example.service';

@Module({
  imports: [
    DataModule.forFeature([Word, Tag, Source, Link, Definition, Example]),
  ],
  controllers: [WordController, ExampleController, DefinitionController],
  providers: [WordService, ExampleService, DefinitionService],
  exports: [],
})
export class WordModule {}
