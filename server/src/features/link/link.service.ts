import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from 'src/core/entities/link.entity';
import { Word } from 'src/core/entities/word.entity';
import { LinkMapper } from 'src/core/mappers/link.mapper';
import { In, Repository } from 'typeorm';
import { LinkPreviewDto, LinkDto, UpsertLinkDto } from './link.dto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link) private readonly linkRepo: Repository<Link>,
    @InjectRepository(Word) private readonly wordRepo: Repository<Word>,
  ) {}

  async findAll(ownerId: string): Promise<LinkPreviewDto[]> {
    const _links = await this.linkRepo.find({
      where: { userId: ownerId },
      relations: {
        words: {
          tags: true,
          links: true,
        },
      },
    });
    return _links.map((link) => LinkMapper.toPreview(link));
  }

  async findOne(id: string, ownerId: string): Promise<LinkDto> {
    return LinkMapper.toDto(
      await this.linkRepo.findOneOrFail({
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

  async create(dto: UpsertLinkDto, ownerId: string): Promise<Link> {
    const _words = await this.wordRepo.find({
      where: { id: In(dto.wordIds), userId: ownerId },
    });

    return this.linkRepo.save(
      this.linkRepo.create({
        ...dto,
        words: _words,
        userId: ownerId,
      }),
    );
  }

  async update(id: string, dto: UpsertLinkDto, ownerId: string): Promise<Link> {
    const _link = await this.linkRepo.findOneOrFail({
      where: { id, userId: ownerId },
    });

    const _words = await this.wordRepo.find({
      where: { id: In(dto.wordIds), userId: ownerId },
    });

    return this.linkRepo.save(
      this.linkRepo.merge(_link, {
        ...dto,
        words: _words,
      }),
    );
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.linkRepo.delete({ id, userId: ownerId });
  }
}
