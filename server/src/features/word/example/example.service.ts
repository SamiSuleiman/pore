import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Example } from 'src/core/entities/example.entity';
import { Word } from 'src/core/entities/word.entity';
import { Repository } from 'typeorm';
import { UpsertExampleDto } from '../example.dto';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepo: Repository<Example>,
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
  ) {}

  async remove(id: string, wordId: string, ownerId: string): Promise<void> {
    const _example = await this.exampleRepo.findOneOrFail({
      relations: {
        word: true,
      },
      where: { id, wordId, word: { userId: ownerId } },
    });

    await this.exampleRepo.delete(_example);
  }

  async create(
    dto: UpsertExampleDto,
    wordId: string,
    ownerId: string,
  ): Promise<Example> {
    const _word = await this.wordRepo.findOneOrFail({
      where: { id: wordId, userId: ownerId },
    });

    return this.exampleRepo.save(
      this.exampleRepo.create({
        ...dto,
        word: _word,
      }),
    );
  }

  async update(
    id: string,
    dto: UpsertExampleDto,
    wordId: string,
    ownerId: string,
  ): Promise<Example> {
    const _example = await this.exampleRepo.findOneOrFail({
      relations: {
        word: true,
      },
      where: { id, wordId, word: { userId: ownerId } },
    });

    return this.exampleRepo.save({
      ..._example,
      ...dto,
    });
  }
}
