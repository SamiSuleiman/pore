import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { WordService } from './word.service';
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
import { AddWordDto, UpsertWordDto } from './word.dto';

describe('UserService', () => {
  let _moduleRef: TestingModule;

  let _wordService: WordService;
  let _userService: UserService;
  let _dataSource: DataSource;
  let _tagRepo: Repository<Tag>;
  let _linkRepo: Repository<Link>;
  let _sourceRepo: Repository<Source>;
  let _wordRepo: Repository<Word>;
  let _definitionRepo: Repository<Definition>;
  let _exampleRepo: Repository<Example>;

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
      providers: [WordService, UserService],
    }).compile();

    _dataSource = _moduleRef.get<DataSource>(DataSource);
    _wordService = _moduleRef.get<WordService>(WordService);
    _userService = _moduleRef.get<UserService>(UserService);

    _tagRepo = _dataSource.getRepository(Tag);
    _linkRepo = _dataSource.getRepository(Link);
    _sourceRepo = _dataSource.getRepository(Source);
    _wordRepo = _dataSource.getRepository(Word);
    _definitionRepo = _dataSource.getRepository(Definition);
    _exampleRepo = _dataSource.getRepository(Example);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('findOne', () => {
    it('returns a word with everything', async () => {
      const _user = await createOrGetUser();

      const { id: _tagId } = await _tagRepo.save(
        _tagRepo.create({
          title: 'test',
          desc: 'test',
          color: 'test',
          userId: _user.id,
        }),
      );

      const { id: _linkId } = await _linkRepo.save(
        _linkRepo.create({
          title: 'test',
          desc: 'test',
          userId: _user.id,
        }),
      );

      const { id: _sourceId } = await _sourceRepo.save(
        _sourceRepo.create({
          type: 'test',
          content: 'test',
          userId: _user.id,
        }),
      );

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        definitions: [
          'this is the first definition',
          'this is the second definition',
        ],
        examples: ['this is the first example', 'this is the second example'],
        language: 'en',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);
      const _result = await _wordService.findOne(_created.id, _user.id);

      expect(_result).toBeDefined();
      expect(_result!.content).toEqual(_created.content);
      expect(_result!.tags.length).toEqual(1);
      expect(_result!.links.length).toEqual(1);
      expect(_result!.source).toBeDefined();
      expect(_result!.definitions.length).toEqual(2);
      expect(_result!.examples.length).toEqual(2);
    });
  });

  describe('findAll', () => {
    it('returns an array of words', async () => {
      const _user = await createOrGetUser();

      const { id: _tagId } = await _tagRepo.save(
        _tagRepo.create({
          title: 'test',
          desc: 'test',
          color: 'test',
          userId: _user.id,
        }),
      );

      const { id: _linkId } = await _linkRepo.save(
        _linkRepo.create({
          title: 'test',
          desc: 'test',
          userId: _user.id,
        }),
      );

      const { id: _sourceId } = await _sourceRepo.save(
        _sourceRepo.create({
          type: 'test',
          content: 'test',
          userId: _user.id,
        }),
      );

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        definitions: [
          'this is the first definition',
          'this is the second definition',
        ],
        examples: ['this is the first example', 'this is the second example'],
        language: 'en',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);
      const _result = await _wordRepo.findOne({
        where: { id: _created.id },
        relations: ['tags', 'links', 'source'],
      });

      expect(_result).toBeDefined();

      const _all = await _wordService.findAll(_user.id);

      expect(_all).toBeDefined();
      expect(_all.length).toEqual(1);
      expect(_all[0].id).toEqual(_result!.id);
      expect(_all[0].content).toEqual(_result!.content);
      expect(_all[0].tags.length).toEqual(1);
      expect(_all[0].links.length).toEqual(1);
      expect(_all[0].source).toBeDefined();
    });
  });

  describe('create', () => {
    it('creates and returns a word with everything', async () => {
      const _user = await createOrGetUser();

      const { id: _tagId } = await _tagRepo.save(
        _tagRepo.create({
          title: 'test',
          desc: 'test',
          color: 'test',
          userId: _user.id,
        }),
      );

      const { id: _linkId } = await _linkRepo.save(
        _linkRepo.create({
          title: 'test',
          desc: 'test',
          userId: _user.id,
        }),
      );

      const { id: _sourceId } = await _sourceRepo.save(
        _sourceRepo.create({
          type: 'test',
          content: 'test',
          userId: _user.id,
        }),
      );

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        definitions: [],
        examples: [],
        language: 'en',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);
      const _result = await _wordRepo.findOne({
        where: { id: _created.id },
        relations: ['tags', 'links', 'source'],
      });

      expect(_result).toBeDefined();

      expect(_result!.userId).toEqual(_user.id);

      expect(_result!.tags.length).toEqual(1);
      expect(_result!.links.length).toEqual(1);
      expect(_result!.source).toBeDefined();

      expect(_result!.source!.id).toEqual(_sourceId);
      expect(_result!.tags.map((tag) => tag.id).includes(_tagId)).toBeTruthy();
      expect(
        _result!.links.map((link) => link.id).includes(_linkId),
      ).toBeTruthy();
    });

    it('creates and returns a word with content only', async () => {
      const _user = await createOrGetUser();
      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        definitions: [],
        examples: [],
        language: 'en',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);
      const _result = await _wordRepo.findOne({ where: { id: _created.id } });

      expect(_result).toBeDefined();
      expect(_result!.userId).toEqual(_user.id);
    });

    it('creates and returns a word with definitions and examples', async () => {
      const _user = await createOrGetUser();
      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [],
        linkIds: [],
        definitions: [
          'this is the first definition',
          'this is the second definition',
        ],
        examples: ['this is the first example', 'this is the second example'],
        language: 'en',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);
      const _result = await _wordRepo.findOne({
        where: { id: _created.id },
        relations: ['definitions', 'examples'],
      });
      // creations result
      expect(_result).toBeDefined();
      expect(_result!.examples.length).toEqual(2);
      expect(_result!.definitions.length).toEqual(2);
      expect(_result!.userId).toEqual(_user.id);

      // check if word is created
      const _word = await _wordRepo.findOne({
        where: { id: _result!.id },
        relations: ['definitions', 'examples'],
      });
      expect(_word).toBeDefined();
      expect(_word!.definitions.length).toEqual(2);
      expect(_word!.examples.length).toEqual(2);

      // check if definitions and examples are created
      const _definitions = await _definitionRepo.find({
        where: { wordId: _result!.id },
      });

      const _examples = await _exampleRepo.find({
        where: { wordId: _result!.id },
      });

      expect(_definitions.length).toEqual(2);
      expect(_examples.length).toEqual(2);
    });
  });

  describe('update', () => {
    it('updates content, keeps relations and returns a word with everything', async () => {
      const _tagRepo = _dataSource.getRepository(Tag);
      const _linkRepo = _dataSource.getRepository(Link);
      const _sourceRepo = _dataSource.getRepository(Source);

      const _user = await createOrGetUser();

      const { id: _tagId } = await _tagRepo.save(
        _tagRepo.create({
          title: 'test',
          desc: 'test',
          color: 'test',
          userId: _user.id,
        }),
      );

      const { id: _linkId } = await _linkRepo.save(
        _linkRepo.create({
          title: 'test',
          desc: 'test',
          userId: _user.id,
        }),
      );

      const { id: _sourceId } = await _sourceRepo.save(
        _sourceRepo.create({
          type: 'test',
          content: 'test',
          userId: _user.id,
        }),
      );

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        definitions: [],
        examples: [],
        language: 'en',
      };

      const _result = await _wordService.create(_addWordDto, _user.id);
      expect(_result).toBeDefined();

      const _updateWordDto: UpsertWordDto = {
        content: 'updated test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        language: 'en',
      };

      await _wordService.update(_result.id, _updateWordDto, _user.id);

      const _updated = await _wordRepo.findOne({
        where: { id: _result.id },
        relations: ['tags', 'links', 'source'],
      });

      expect(_updated).toBeDefined();
      expect(_updated!.content).toEqual(_updateWordDto.content);
      expect(_updated!.tags.length).toEqual(1);
      expect(_updated!.links.length).toEqual(1);
      expect(_updated!.source?.id).toEqual(_sourceId);
    });
    it('updates and returns a word with everything', async () => {
      const _tagRepo = _dataSource.getRepository(Tag);
      const _linkRepo = _dataSource.getRepository(Link);
      const _sourceRepo = _dataSource.getRepository(Source);

      const _user = await createOrGetUser();

      const { id: _tagId } = await _tagRepo.save(
        _tagRepo.create({
          title: 'test',
          desc: 'test',
          color: 'test',
          userId: _user.id,
        }),
      );

      const { id: _linkId } = await _linkRepo.save(
        _linkRepo.create({
          title: 'test',
          desc: 'test',
          userId: _user.id,
        }),
      );

      const { id: _sourceId } = await _sourceRepo.save(
        _sourceRepo.create({
          type: 'test',
          content: 'test',
          userId: _user.id,
        }),
      );

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        definitions: [],
        examples: [],
        language: 'en',
      };

      const _result = await _wordService.create(_addWordDto, _user.id);
      expect(_result).toBeDefined();

      const _updateWordDto: UpsertWordDto = {
        content: 'updated test',
        tagIds: [],
        linkIds: [],
        sourceId: undefined,
        language: 'en',
      };

      await _wordService.update(_result.id, _updateWordDto, _user.id);

      const _updated = await _wordRepo.findOne({
        where: { id: _result.id },
        relations: ['tags', 'links', 'source'],
      });

      expect(_updated).toBeDefined();
      expect(_updated!.content).toEqual(_updateWordDto.content);
      expect(_updated!.tags.length).toEqual(0);
      expect(_updated!.links.length).toEqual(0);
      expect(_updated!.sourceId).toEqual(null);
    });
  });

  describe('remove', () => {
    it('removes a word with and cascade', async () => {
      const _user = await createOrGetUser();

      const { id: _tagId } = await _tagRepo.save(
        _tagRepo.create({
          title: 'test',
          desc: 'test',
          color: 'test',
          userId: _user.id,
        }),
      );

      const { id: _linkId } = await _linkRepo.save(
        _linkRepo.create({
          title: 'test',
          desc: 'test',
          userId: _user.id,
        }),
      );

      const { id: _sourceId } = await _sourceRepo.save(
        _sourceRepo.create({
          type: 'test',
          content: 'test',
          userId: _user.id,
        }),
      );

      const _addWordDto: AddWordDto = {
        content: 'test',
        tagIds: [_tagId],
        linkIds: [_linkId],
        sourceId: _sourceId,
        definitions: ['this is a definition'],
        examples: ['this is an example'],
        language: 'en',
      };

      const _created = await _wordService.create(_addWordDto, _user.id);
      const _result = await _wordRepo.findOne({
        where: { id: _created.id },
        relations: ['tags', 'links', 'source'],
      });

      expect(_result).toBeDefined();

      await _wordService.remove(_result!.id, _user.id);

      expect(
        await _wordRepo.findOne({
          where: { id: _created.id },
          relations: ['definitions', 'examples'],
        }),
      ).toBeNull();

      expect(
        await _definitionRepo.findOne({
          where: { wordId: _created.id },
        }),
      ).toBeNull();

      expect(
        await _exampleRepo.findOne({
          where: { wordId: _created.id },
        }),
      ).toBeNull();

      expect(await _tagRepo.findOne({ where: { id: _tagId } })).toBeDefined();
      expect(await _linkRepo.findOne({ where: { id: _linkId } })).toBeDefined();
      expect(
        await _sourceRepo.findOne({ where: { id: _sourceId } }),
      ).toBeDefined();
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
