import { Module } from '@nestjs/common';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';
import { DataModule } from 'src/data/data.module';
import { Source } from 'src/core/entities/source.entity';
import { Word } from 'src/core/entities/word.entity';

@Module({
  imports: [DataModule.forFeature([Source, Word])],
  controllers: [SourceController],
  providers: [SourceService],
  exports: [],
})
export class SourceModule {}
