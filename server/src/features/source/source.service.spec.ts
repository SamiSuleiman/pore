import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { SourceService } from './source.service';
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
import { UpsertSourceDto } from './source.dto';

describe('SourceService', () => {
  let _moduleRef: TestingModule;

  let _sourceService: SourceService;
  let _userService: UserService;
  let _dataSource: DataSource;
  let _wordRepo: Repository<Word>;

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
      providers: [SourceService, UserService],
    }).compile();

    _dataSource = _moduleRef.get<DataSource>(DataSource);
    _sourceService = _moduleRef.get<SourceService>(SourceService);
    _userService = _moduleRef.get<UserService>(UserService);

    _wordRepo = _dataSource.getRepository(Word);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('findOne', () => {
    it('should return a source', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);

      const _sourceToCreate: UpsertSourceDto = {
        type: 'the book of allah',
        content: 'www.allah.com',
        wordIds: [_firstWord.id],
      };

      const _source = await _sourceService.create(_sourceToCreate, _user.id);

      expect(_source).toBeDefined();
      expect(_source.id).toBeDefined();
      expect(_source.type).toEqual(_sourceToCreate.type);
      expect(_source.content).toEqual(_sourceToCreate.content);
      expect(_source.words).toBeDefined();
      expect(_source.words.length).toEqual(1);
    });
  });

  describe('findAll', () => {
    it('should return source', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _sourceToCreate: UpsertSourceDto = {
        type: 'the book of allah',
        content: 'www.allah.com',
        wordIds: [_firstWord.id],
      };

      const _anotherSourceToCreate: UpsertSourceDto = {
        type: 'the book of allah',
        content: 'www.allah.com',
        wordIds: [_secondWord.id],
      };

      await _sourceService.create(_sourceToCreate, _user.id);
      await _sourceService.create(_anotherSourceToCreate, _user.id);

      const _sources = await _sourceService.findAll(_user.id);

      expect(_sources).toBeDefined();
      expect(_sources.length).toEqual(2);
    });
  });

  describe('create', () => {
    it('should create a source', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);

      const _sourceToCreate: UpsertSourceDto = {
        type: 'the book of allah',
        content: 'www.allah.com',
        wordIds: [_firstWord.id],
      };

      const _createdSource = await _sourceService.create(
        _sourceToCreate,
        _user.id,
      );

      const _source = await _sourceService.findOne(_createdSource.id, _user.id);

      expect(_source).toBeDefined();
      expect(_source.id).toBeDefined();
      expect(_source.type).toEqual(_sourceToCreate.type);
      expect(_source.content).toEqual(_sourceToCreate.content);
      expect(_source.words).toBeDefined();
      expect(_source.words.length).toEqual(1);
    });
  });

  describe('update', () => {
    it('should update a source', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);

      const _sourceToCreate: UpsertSourceDto = {
        type: 'the book of allah',
        content: 'www.allah.com',
        wordIds: [_firstWord.id],
      };

      const _createdSource = await _sourceService.create(
        _sourceToCreate,
        _user.id,
      );

      const _sourceToUpdate: UpsertSourceDto = {
        type: 'updated book of allah',
        content: 'www.updatedAllah.com',
        wordIds: [],
      };

      const _updatedSource = await _sourceService.update(
        _createdSource.id,
        _sourceToUpdate,
        _user.id,
      );

      const _source = await _sourceService.findOne(_updatedSource.id, _user.id);

      expect(_source).toBeDefined();
      expect(_source.id).toBeDefined();
      expect(_source.type).toEqual(_sourceToUpdate.type);
      expect(_source.content).toEqual(_sourceToUpdate.content);
      expect(_source.words).toBeDefined();
      expect(_source.words.length).toEqual(0);
    });
  });

  describe('remove', () => {
    it('should remove a source', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);

      const _sourceToCreate: UpsertSourceDto = {
        type: 'the book of allah',
        content: 'www.allah.com',
        wordIds: [_firstWord.id],
      };

      const _createdSource = await _sourceService.create(
        _sourceToCreate,
        _user.id,
      );

      await _sourceService.remove(_createdSource.id, _user.id);

      const _source = await _dataSource.getRepository(Source).findOne({
        where: { id: _createdSource.id },
      });

      expect(_source).toBeNull();
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

  async function createWord(user: User): Promise<Word> {
    const _word: Word = {
      id: crypto.randomUUID(),
      content: '',
      language: '',
      tags: [],
      links: [],
      definitions: [],
      examples: [],
      source: null,
      sourceId: null,
      user,
      userId: user.id,
    };

    return _wordRepo.save(_wordRepo.create(_word));
  }
});
