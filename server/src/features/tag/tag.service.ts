import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/core/entities/tag.entity';
import { Word } from 'src/core/entities/word.entity';
import { TagMapper } from 'src/core/mappers/tag.mapper';
import { In, Repository } from 'typeorm';
import { TagPreviewDto, TagDto, UpsertTagDto } from './tag.dto';
import { List } from '../model';
import { PAGE_SIZE } from 'src/consts';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Word) private readonly wordRepo: Repository<Word>,
  ) {}

  async findAll(ownerId: string, page: number): Promise<List<TagPreviewDto>> {
    const _tagsCount = await this.tagRepo.count({ where: { userId: ownerId } });
    const _pagedTags = await this.tagRepo
      .createQueryBuilder()
      .where('userId = :userId', { userId: ownerId })
      .skip(page * PAGE_SIZE)
      .take(PAGE_SIZE)
      .getMany();

    return {
      items: _pagedTags.map((tag) => TagMapper.toPreview(tag)),
      count: _tagsCount,
    };
  }

  async findOne(id: string, ownerId: string): Promise<TagDto> {
    return TagMapper.toDto(
      await this.tagRepo.findOneOrFail({
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

  async create(dto: UpsertTagDto, ownerId: string): Promise<Tag> {
    const _words = await this.wordRepo.find({
      where: { id: In(dto.wordIds), userId: ownerId },
    });

    return this.tagRepo.save(
      this.tagRepo.create({
        ...dto,
        words: _words,
        userId: ownerId,
      }),
    );
  }

  async update(id: string, dto: UpsertTagDto, ownerId: string): Promise<Tag> {
    const _words = await this.wordRepo.find({
      where: { id: In(dto.wordIds), userId: ownerId },
    });

    const _tag = await this.tagRepo.findOneOrFail({
      where: { id, userId: ownerId },
    });

    return this.tagRepo.save(
      this.tagRepo.merge(_tag, {
        ...dto,
        words: _words,
      }),
    );
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.tagRepo.delete({ id, userId: ownerId });
  }
}
