import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Definition } from 'src/core/entities/definition.entity';
import { Example } from 'src/core/entities/example.entity';
import { Link } from 'src/core/entities/link.entity';
import { Source } from 'src/core/entities/source.entity';
import { Tag } from 'src/core/entities/tag.entity';
import { Word } from 'src/core/entities/word.entity';
import { WordMapper } from 'src/core/mappers/word.mapper';
import { In, Repository } from 'typeorm';
import { WordPreviewDto, WordDto, UpsertWordDto } from './word.dto';
import { PAGE_SIZE } from 'src/consts';
import { List } from '../model';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word) private readonly wordRepo: Repository<Word>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Source)
    private readonly sourceRepo: Repository<Source>,
    @InjectRepository(Link) private readonly linkRepo: Repository<Link>,
    @InjectRepository(Example)
    private readonly exampleRepo: Repository<Example>,
    @InjectRepository(Definition)
    private readonly definitionRepo: Repository<Definition>,
  ) {}

  async findAll(ownerId: string, page: number): Promise<List<WordPreviewDto>> {
    const allWordsCount = await this.wordRepo.count({
      where: { userId: ownerId },
    });
    const _pagedWords = await this.wordRepo
      .createQueryBuilder('word')
      .where('word.userId = :ownerId', { ownerId })
      .skip(page * PAGE_SIZE)
      .take(PAGE_SIZE)
      .leftJoinAndMapMany('word.links', 'word.links', 'link')
      .leftJoinAndMapMany('word.tags', 'word.tags', 'tag')
      .leftJoinAndMapOne('word.source', 'word.source', 'source')
      .getMany();

    return {
      items: _pagedWords.map((word) =>
        WordMapper.toPreview({
          ...word,
          links: word.links.filter((link) => link.words?.length > 1) ?? [],
        }),
      ),
      count: allWordsCount,
    };
  }

  async findOne(id: string, ownerId: string): Promise<WordDto> {
    const _word = await this.wordRepo.findOneOrFail({
      where: { id, userId: ownerId },
      relations: {
        tags: true,
        links: {
          words: true,
        },
        source: true,
        definitions: true,
        examples: true,
      },
    });

    return WordMapper.toDto(_word);
  }

  async create(dto: UpsertWordDto, userId: string): Promise<Word> {
    const { tags, source, links } = await this.getRelations(dto);

    const _word = await this.wordRepo.save(
      this.wordRepo.create({
        content: dto.content,
        tags,
        links,
        source: source,
        userId,
        language: dto.language,
      }),
    );

    const _definitions = await this.definitionRepo.save(
      this.definitionRepo.create(
        dto.definitions.map((content) => ({
          content,
          wordId: _word.id,
        })),
      ),
    );

    const _examples = await this.exampleRepo.save(
      this.exampleRepo.create(
        dto.examples.map((content) => ({
          content,
          wordId: _word.id,
        })),
      ),
    );

    return {
      ..._word,
      definitions: _definitions,
      examples: _examples,
    };
  }

  async update(id: string, dto: UpsertWordDto, ownerId: string): Promise<Word> {
    const _word = await this.wordRepo.findOneOrFail({
      where: { id, userId: ownerId },
      relations: {
        tags: true,
        links: true,
        source: true,
      },
    });

    const { tags, source, links } = await this.getRelations(dto);

    _word.content = dto.content;
    _word.language = dto.language;
    _word.tags = tags;
    _word.links = links;
    _word.source = source;

    // todo: this is a garbage workaround for a simple problem,
    // there are better ways, i think this is a common problem and can be solved better?
    await this.definitionRepo.delete({ wordId: _word.id });
    await this.exampleRepo.delete({ wordId: _word.id });

    const _definitions = await this.definitionRepo.save(
      this.definitionRepo.create(
        dto.definitions.map((content) => ({
          content,
          wordId: _word.id,
        })),
      ),
    );

    const _examples = await this.exampleRepo.save(
      this.exampleRepo.create(
        dto.examples.map((content) => ({
          content,
          wordId: _word.id,
        })),
      ),
    );

    return await this.wordRepo.save({
      ..._word,
      definitions: _definitions,
      examples: _examples,
    });
    // return await this.wordRepo.save(_word);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.wordRepo.delete({ id, userId: ownerId });
  }

  private async getRelations(dto: UpsertWordDto | UpsertWordDto): Promise<{
    tags: Tag[];
    source: Source | null;
    links: Link[];
  }> {
    const _tags = await this.tagRepo.find({
      where: { id: In(dto.tagIds) },
    });

    const _links = await this.linkRepo.find({
      where: { id: In(dto.linkIds) },
    });

    const _source = dto.sourceId
      ? await this.sourceRepo.findOne({
          where: { id: dto.sourceId },
        })
      : null;

    return {
      tags: _tags,
      source: _source,
      links: _links,
    };
  }
}
