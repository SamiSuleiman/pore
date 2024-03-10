import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { Link } from 'src/core/entities/link.entity';
import { Word } from 'src/core/entities/word.entity';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule.forFeature([Link, Word])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [],
})
export class LinkModule {}
