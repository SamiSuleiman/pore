import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WordService } from '../word.service';
import { DefinitionService } from './definition.service';
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

describe('DefinitionService', () => {
  let _moduleRef: TestingModule;

  let _definitionService: DefinitionService;
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
      providers: [DefinitionService, UserService, WordService],
    }).compile();

    _definitionService = _moduleRef.get<DefinitionService>(DefinitionService);
    _userService = _moduleRef.get<UserService>(UserService);
    _wordService = _moduleRef.get<WordService>(WordService);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('remove', () => {
    it('removes an definition for a word', async () => {
      const _user = await createOrGetUser();

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        definitions: [
          'this is the first definition',
          'this is the second definition',
        ],
        examples: [],
        language: 'en',
      };

      const _createdWord = await _wordService.create(_addWordDto, _user.id);

      const _foundCreatedWord = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      const _definitionToRemove = _foundCreatedWord!.definitions![0];

      await _definitionService.remove(
        _definitionToRemove.id,
        _foundCreatedWord!.id,
        _user.id,
      );

      const _updatedResult = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      expect(_updatedResult?.definitions).toBeDefined();
      expect(_updatedResult?.definitions?.length).toBe(1);
      expect(
        _updatedResult?.definitions!.find(
          (e) => e.id === _definitionToRemove.id,
        ),
      ).toBeUndefined();
    });
  });

  describe('update', () => {
    it('updates an definition for a word', async () => {
      const _user = await createOrGetUser();

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        definitions: [
          'this is the first definition',
          'this is the second definition',
        ],
        examples: [],
        language: 'en',
      };

      const _createdWord = await _wordService.create(_addWordDto, _user.id);

      const _foundCreatedWord = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      expect(_foundCreatedWord).toBeDefined();
      expect(_foundCreatedWord?.definitions).toBeDefined();
      expect(_foundCreatedWord?.definitions?.length).toBe(2);

      const _updated: UpsertExampleDto = {
        content: 'this is the updated first definition',
      };

      const _definitionToUpdate = _foundCreatedWord!.definitions![0];

      await _definitionService.update(
        _definitionToUpdate.id,
        _updated,
        _foundCreatedWord!.id,
        _user.id,
      );

      const _updatedResult = await _wordService.findOne(
        _createdWord.id,
        _user.id,
      );

      expect(_updatedResult).toBeDefined();
      expect(_updatedResult?.definitions).toBeDefined();
      expect(_updatedResult?.definitions?.length).toBe(2);
      expect(
        _updatedResult?.definitions!.find(
          (e) => e.id === _definitionToUpdate.id,
        )?.content,
      ).toBe(_updated.content);
    });
  });

  describe('create', () => {
    it('creates an definition for a word', async () => {
      const _user = await createOrGetUser();

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        examples: [],
        definitions: [
          'this is the first definition',
          'this is the second definition',
        ],
        language: 'en',
      };

      const _addExampleDto: UpsertExampleDto = {
        content: 'this is the first definition',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);

      expect(
        (await _wordService.findOne(_created.id, _user.id))?.definitions
          ?.length,
      ).toBe(2);

      await _definitionService.create(_addExampleDto, _created!.id, _user.id);

      const _result = await _wordService.findOne(_created.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result?.definitions).toBeDefined();
      expect(_result?.definitions?.length).toBe(3);
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
