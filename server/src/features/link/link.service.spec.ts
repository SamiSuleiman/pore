import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { LinkService } from './link.service';
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
import { UpsertLinkDto } from './link.dto';

describe('LinkService', () => {
  let _moduleRef: TestingModule;

  let _linkService: LinkService;
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
      providers: [LinkService, UserService],
    }).compile();

    _dataSource = _moduleRef.get<DataSource>(DataSource);
    _linkService = _moduleRef.get<LinkService>(LinkService);
    _userService = _moduleRef.get<UserService>(UserService);

    _wordRepo = _dataSource.getRepository(Word);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('findOne', () => {
    it('should return a link', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _linkToCreate: UpsertLinkDto = {
        title: '',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _link = await _linkService.create(_linkToCreate, _user.id);
      const _result = await _linkService.findOne(_link.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result.id).toEqual(_link.id);
      expect(_result.title).toEqual(_link.title);
      expect(_result.desc).toEqual(_link.desc);
      expect(_result.words).toBeDefined();
      expect(_result.words.length).toEqual(2);
    });
  });

  describe('findAll', () => {
    it('should return link', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _firstLinkToCreate: UpsertLinkDto = {
        title: '',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _secondLinkToCreate: UpsertLinkDto = {
        title: '',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _firstLink = await _linkService.create(
        _firstLinkToCreate,
        _user.id,
      );

      const _secondLink = await _linkService.create(
        _secondLinkToCreate,
        _user.id,
      );

      const _result = await _linkService.findAll(_user.id);

      expect(_result).toBeDefined();
      expect(_result.length).toEqual(2);
      expect(_result[0].id).toBeDefined();
      expect(_result[0].title).toEqual(_firstLink.title);
      expect(_result[1].id).toBeDefined();
      expect(_result[1].title).toEqual(_secondLink.title);
    });
  });

  describe('create', () => {
    it('should create a link', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _linkToCreate: UpsertLinkDto = {
        title: '',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _link = await _linkService.create(_linkToCreate, _user.id);
      const _result = await _linkService.findOne(_link.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result.id).toEqual(_link.id);
      expect(_result.title).toEqual(_link.title);
      expect(_result.desc).toEqual(_link.desc);
      expect(_result.words).toBeDefined();
      expect(_result.words.length).toEqual(2);
    });
  });

  describe('update', () => {
    it('should update a link', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _linkToCreate: UpsertLinkDto = {
        title: 'test',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _linkToUpdate: UpsertLinkDto = {
        title: 'updated name',
        desc: 'synonym',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _link = await _linkService.create(_linkToCreate, _user.id);

      await _linkService.update(_link.id, _linkToUpdate, _user.id);

      const _result = await _linkService.findOne(_link.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result.id).toEqual(_link.id);
      expect(_result.title).toEqual(_linkToUpdate.title);
      expect(_result.desc).toEqual(_linkToUpdate.desc);
      expect(_result.words).toBeDefined();
      expect(_result.words.length).toEqual(2);
    });

    it('should throw an error "link must have at least 2 words"', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _linkToCreate: UpsertLinkDto = {
        title: 'test',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _linkToUpdate: UpsertLinkDto = {
        title: 'updated name',
        desc: 'synonym',
        wordIds: [_firstWord.id],
      };

      const _link = await _linkService.create(_linkToCreate, _user.id);

      await expect(
        async () =>
          await _linkService.update(_link.id, _linkToUpdate, _user.id),
      ).rejects.toThrow('Link must have at least 2 words');

      const _result = await _linkService.findOne(_link.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result.id).toEqual(_link.id);
      expect(_result.title).toEqual(_linkToCreate.title);
      expect(_result.desc).toEqual(_linkToCreate.desc);
      expect(_result.words).toBeDefined();
      expect(_result.words.length).toEqual(2);
    });
  });

  describe('remove', () => {
    it('should remove a link', async () => {
      const _user = await createOrGetUser();
      const _firstWord = await createWord(_user);
      const _secondWord = await createWord(_user);

      const _linkToCreate: UpsertLinkDto = {
        title: 'test',
        desc: 'translation',
        wordIds: [_firstWord.id, _secondWord.id],
      };

      const _link = await _linkService.create(_linkToCreate, _user.id);

      await _linkService.remove(_link.id, _user.id);

      const _result = await _dataSource.getRepository(Link).findOne({
        where: {
          id: _link.id,
          userId: _user.id,
        },
      });

      expect(_result).toBeNull();
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
