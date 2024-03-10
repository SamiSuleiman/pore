import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Definition } from 'src/core/entities/definition.entity';
import { Word } from 'src/core/entities/word.entity';
import { Repository } from 'typeorm';
import { UpsertDefinitionDto } from '../definition.dto';

@Injectable()
export class DefinitionService {
  constructor(
    @InjectRepository(Definition)
    private readonly definitionRepo: Repository<Definition>,
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
  ) {}

  async remove(id: string, wordId: string, ownerId: string): Promise<void> {
    const _definition = await this.definitionRepo.findOneOrFail({
      relations: {
        word: true,
      },
      where: { id, wordId, word: { userId: ownerId } },
    });

    await this.definitionRepo.delete(_definition);
  }

  async create(
    dto: UpsertDefinitionDto,
    wordId: string,
    ownerId: string,
  ): Promise<Definition> {
    const _word = await this.wordRepo.findOneOrFail({
      where: { id: wordId, userId: ownerId },
    });

    return this.definitionRepo.save(
      this.definitionRepo.create({
        ...dto,
        word: _word,
      }),
    );
  }

  async update(
    id: string,
    dto: UpsertDefinitionDto,
    wordId: string,
    ownerId: string,
  ): Promise<Definition> {
    const _Definition = await this.definitionRepo.findOneOrFail({
      relations: {
        word: true,
      },
      where: { id, wordId, word: { userId: ownerId } },
    });

    return this.definitionRepo.save({
      ..._Definition,
      ...dto,
    });
  }
}
