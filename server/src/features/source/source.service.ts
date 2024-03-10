import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from 'src/core/entities/source.entity';
import { Word } from 'src/core/entities/word.entity';
import { SourceMapper } from 'src/core/mappers/source.mapper';
import { In, Repository } from 'typeorm';
import { SourcePreviewDto, SourceDto, UpsertSourceDto } from './source.dto';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source) private readonly sourceRepo: Repository<Source>,
    @InjectRepository(Word) private readonly wordRepo: Repository<Word>,
  ) {}

  async findAll(ownerId: string): Promise<SourcePreviewDto[]> {
    const _sources = await this.sourceRepo.find({ where: { userId: ownerId } });
    return _sources.map((source) => SourceMapper.toPreview(source));
  }

  async findOne(id: string, ownerId: string): Promise<SourceDto> {
    return SourceMapper.toDto(
      await this.sourceRepo.findOneOrFail({
        where: { id, userId: ownerId },
        relations: {
          words: {
            tags: true,
            links: true,
          },
        },
      }),
    );
  }

  async create(dto: UpsertSourceDto, ownerId: string): Promise<Source> {
    const _words = await this.wordRepo.find({
      where: { id: In(dto.wordIds), userId: ownerId },
    });

    return this.sourceRepo.save(
      this.sourceRepo.create({
        ...dto,
        words: _words,
        userId: ownerId,
      }),
    );
  }

  async update(
    id: string,
    dto: UpsertSourceDto,
    ownerId: string,
  ): Promise<Source> {
    const _words = await this.wordRepo.find({
      where: { id: In(dto.wordIds), userId: ownerId },
    });

    const _source = await this.sourceRepo.findOneOrFail({
      where: { id, userId: ownerId },
    });

    return this.sourceRepo.save(
      this.sourceRepo.merge(_source, {
        ...dto,
        words: _words,
      }),
    );
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.sourceRepo.delete({ id, userId: ownerId });
  }
}
