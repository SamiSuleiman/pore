import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from 'src/core/entities/source.entity';
import { Word } from 'src/core/entities/word.entity';
import { SourceMapper } from 'src/core/mappers/source.mapper';
import { In, Repository } from 'typeorm';
import { SourcePreviewDto, SourceDto, UpsertSourceDto } from './source.dto';
import { List } from '../model';
import { PAGE_SIZE } from 'src/consts';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source) private readonly sourceRepo: Repository<Source>,
    @InjectRepository(Word) private readonly wordRepo: Repository<Word>,
  ) {}

  async findAll(
    ownerId: string,
    page: number,
  ): Promise<List<SourcePreviewDto>> {
    const _sourcesCount = await this.sourceRepo.count({
      where: { userId: ownerId },
    });
    const _pagedSources = await this.sourceRepo
      .createQueryBuilder()
      .where('userId = :userId', { userId: ownerId })
      .skip(page === -1 ? undefined : page * PAGE_SIZE)
      .take(page === -1 ? undefined : PAGE_SIZE)
      .getMany();

    return {
      items: _pagedSources.map((source) => SourceMapper.toPreview(source)),
      count: _sourcesCount,
    };
  }

  async findOne(id: string, ownerId: string): Promise<SourceDto> {
    return SourceMapper.toDto(
      await this.sourceRepo.findOneOrFail({
        where: { id, userId: ownerId },
        relations: {
          words: {
            tags: true,
            links: {
              words: true,
            },
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
