import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WordService } from '../word.service';
import { ExampleService } from './example.service';
import { Definition } from 'src/core/entities/definition.entity';
import { Example } from 'src/core/entities/example.entity';
import { Link } from 'src/core/entities/link.entity';
import { Source } from 'src/core/entities/source.entity';
import { Tag } from 'src/core/entities/tag.entity';
import { User } from 'src/core/entities/user.entity';
import { Word } from 'src/core/entities/word.entity';
import { DataModule } from 'src/data/data.module';
import { UserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { UpsertExampleDto } from '../example.dto';
import { AddWordDto } from '../word.dto';

describe('ExampleService', () => {
  let _moduleRef: TestingModule;

  let _exampleService: ExampleService;
  let _wordService: WordService;
  let _userService: UserService;

  beforeEach(async () => {
    _moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: './.env.test' }),
        DataModule.forRoot({
          type: 'sqlite',
          host: 'TEST_DB_HOST',
          port: 'TEST_DB_PORT',
          username: 'TEST_DB_USERNAME',
          password: 'TEST_DB_PASS',
          database: 'TEST_DB_NAME',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
          logging: false,
          migrationsRun: false,
        }),
        DataModule.forFeature([
          User,
          Word,
          Source,
          Link,
          Tag,
          Definition,
          Example,
        ]),
      ],
      providers: [ExampleService, UserService, WordService],
    }).compile();

    _exampleService = _moduleRef.get<ExampleService>(ExampleService);
    _userService = _moduleRef.get<UserService>(UserService);
    _wordService = _moduleRef.get<WordService>(WordService);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('remove', () => {
    it('removes an example for a word', async () => {
      const _user = await createOrGetUser();

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        definitions: [],
        examples: ['this is the first example', 'this is the second example'],
        language: 'en',
      };

      const _createdWord = await _wordService.create(_addWordDto, _user.id);

      const _foundCreatedWord = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      const _exampleToRemove = _foundCreatedWord!.examples![0];

      await _exampleService.remove(
        _exampleToRemove.id,
        _foundCreatedWord!.id,
        _user.id,
      );

      const _updatedResult = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      expect(_updatedResult?.examples).toBeDefined();
      expect(_updatedResult?.examples?.length).toBe(1);
      expect(
        _updatedResult?.examples!.find((e) => e.id === _exampleToRemove.id),
      ).toBeUndefined();
    });
  });

  describe('update', () => {
    it('updates an example for a word', async () => {
      const _user = await createOrGetUser();

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        definitions: [],
        examples: ['this is the first example', 'this is the second example'],
        language: 'en',
      };

      const _createdWord = await _wordService.create(_addWordDto, _user.id);

      const _foundCreatedWord = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      expect(_foundCreatedWord).toBeDefined();
      expect(_foundCreatedWord?.examples).toBeDefined();
      expect(_foundCreatedWord?.examples?.length).toBe(2);

      const _updated: UpsertExampleDto = {
        content: 'this is the updated first example',
      };

      const _exampleToUpdate = _foundCreatedWord!.examples![0];

      await _exampleService.update(
        _exampleToUpdate.id,
        _updated,
        _foundCreatedWord!.id,
        _user.id,
      );

      const _updatedResult = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      expect(_updatedResult).toBeDefined();
      expect(_updatedResult?.examples).toBeDefined();
      expect(_updatedResult?.examples?.length).toBe(2);
      expect(
        _updatedResult?.examples!.find((e) => e.id === _exampleToUpdate.id)
          ?.content,
      ).toBe(_updated.content);
    });
  });

  describe('create', () => {
    it('creates an example for a word', async () => {
      const _user = await createOrGetUser();

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        definitions: [],
        examples: ['this is the first example', 'this is the second example'],
        language: 'en',
      };

      const _addExampleDto: UpsertExampleDto = {
        content: 'this is the first example',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);

      expect(
        (await _wordService.findOne(_created.id, _user.id))?.examples?.length,
      ).toBe(2);

      await _exampleService.create(_addExampleDto, _created!.id, _user.id);

      const _result = await _wordService.findOne(_created.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result?.examples).toBeDefined();
      expect(_result?.examples?.length).toBe(3);
    });
  });

  async function createOrGetUser(): Promise<User> {
    const _user = await _userService.getOrCreate({
      name: 'test',
      email: 'test@test.test',
      avatar: 'test',
      createdAt: new Date(),
    } as UserDto);

    return _user;
  }
});
