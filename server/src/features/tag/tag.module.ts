import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from 'src/core/entities/tag.entity';
import { Word } from 'src/core/entities/word.entity';
import { DataModule } from 'src/data/data.module';
import { TagController } from './tag.controller';

@Module({
  imports: [DataModule.forFeature([Tag, Word])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
