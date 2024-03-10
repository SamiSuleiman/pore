import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { TagService } from './tag.service';
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
import { UpsertTagDto } from './tag.dto';

describe('TagService', () => {
  let _moduleRef: TestingModule;

  let _tagService: TagService;
  let _userService: UserService;
  let _dataSource: DataSource;
  let _tagRepo: Repository<Tag>;
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
      providers: [TagService, UserService],
    }).compile();

    _dataSource = _moduleRef.get<DataSource>(DataSource);
    _tagService = _moduleRef.get<TagService>(TagService);
    _userService = _moduleRef.get<UserService>(UserService);

    _tagRepo = _dataSource.getRepository(Tag);
    _wordRepo = _dataSource.getRepository(Word);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('findOne', () => {
    it('should return a tag', async () => {
      const _user = await createOrGetUser();
      const _word = await createWord(_user);

      const _tagToCreate: UpsertTagDto = {
        title: 'test',
        color: '#test;',
        desc: 'test desc',
        wordIds: [_word.id],
      };

      const _tag = await _tagService.create(_tagToCreate, _user.id);
      const _result = await _tagService.findOne(_tag.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result.id).toEqual(_tag.id);
      expect(_result.title).toEqual(_tag.title);
      expect(_result.color).toEqual(_tag.color);
      expect(_result.desc).toEqual(_tag.desc);
      expect(_result.words).toBeDefined();
      expect(_result.words.length).toEqual(1);
      expect(_result.words[0].id).toEqual(_word.id);
    });
  });

  describe('findAll', () => {
    it('should return tags', async () => {
      const _user = await createOrGetUser();
      const _word = await createWord(_user);

      const _tagToCreate: UpsertTagDto = {
        title: 'test',
        color: '#test;',
        desc: 'test desc',
        wordIds: [_word.id],
      };

      const _tag2ToCreate: UpsertTagDto = {
        title: 'test',
        color: '#test;',
        desc: 'test desc',
        wordIds: [_word.id],
      };

      await _tagService.create(_tagToCreate, _user.id);
      await _tagService.create(_tag2ToCreate, _user.id);

      const _result = await _tagService.findAll(_user.id);

      expect(_result).toBeDefined();
      expect(_result.length).toEqual(2);
      expect(_result[0].id).toBeDefined();
      expect(_result[0].title).toEqual(_tagToCreate.title);
      expect(_result[0].color).toEqual(_tagToCreate.color);
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const _user = await createOrGetUser();
      const _word = await createWord(_user);

      const _tagToCreate: UpsertTagDto = {
        title: 'test',
        color: '#test;',
        desc: 'test desc',
        wordIds: [_word.id],
      };

      await _tagService.create(_tagToCreate, _user.id);

      const _result = await _tagRepo.findOne({
        where: { userId: _user.id },
        relations: ['words'],
      });

      expect(_result).toBeDefined();
      expect(_result?.id).toBeDefined();
      expect(_result?.title).toEqual(_tagToCreate.title);
      expect(_result?.color).toEqual(_tagToCreate.color);
      expect(_result?.desc).toEqual(_tagToCreate.desc);
      expect(_result?.words).toBeDefined();
      expect(_result?.words.length).toEqual(1);
      expect(_result?.words[0].id).toEqual(_word.id);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const _user = await createOrGetUser();
      const _oldWord = await createWord(_user);
      const _updatedTag = await createWord(_user);

      const _tagToCreate: UpsertTagDto = {
        title: 'test',
        color: '#test;',
        desc: 'test desc',
        wordIds: [_oldWord.id],
      };

      const _tag = await _tagService.create(_tagToCreate, _user.id);

      const _tagToUpdate: UpsertTagDto = {
        title: 'test2',
        color: '#test2;',
        desc: 'test desc2',
        wordIds: [_updatedTag.id],
      };

      await _tagService.update(_tag.id, _tagToUpdate, _user.id);

      const _updated = await _tagRepo.findOne({
        where: { userId: _user.id },
        relations: ['words'],
      });

      expect(_updated).toBeDefined();
      expect(_updated?.id).toEqual(_tag.id);
      expect(_updated?.title).toEqual(_tagToUpdate.title);
      expect(_updated?.color).toEqual(_tagToUpdate.color);
      expect(_updated?.desc).toEqual(_tagToUpdate.desc);
      expect(_updated?.words).toBeDefined();
      expect(_updated?.words.length).toEqual(1);
      expect(_updated?.words[0].id).toEqual(_updatedTag.id);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const _user = await createOrGetUser();
      const _word = await createWord(_user);

      const _tagToCreate: UpsertTagDto = {
        title: 'test',
        color: '#test;',
        desc: 'test desc',
        wordIds: [_word.id],
      };

      const _tag = await _tagService.create(_tagToCreate, _user.id);

      await _tagService.remove(_tag.id, _user.id);

      const _result = await _tagRepo.findOne({
        where: { userId: _user.id },
        relations: ['words'],
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
