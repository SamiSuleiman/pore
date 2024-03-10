import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto as SharedUserDto } from './user.dto';
import { UserService } from './user.service';
import { DataModule } from 'src/data/data.module';
import { DataModuleOptions } from 'src/data/data.mode';
import { Definition } from 'src/core/entities/definition.entity';
import { Example } from 'src/core/entities/example.entity';
import { Link } from 'src/core/entities/link.entity';
import { Source } from 'src/core/entities/source.entity';
import { Tag } from 'src/core/entities/tag.entity';
import { User } from 'src/core/entities/user.entity';
import { UserDto } from 'src/core/entities/user.entity';
import { Word } from 'src/core/entities/word.entity';

describe('UserService', () => {
  let _userService: UserService;
  let _moduleRef: TestingModule;
  let _now: Date;
  let _dto: UserDto;

  beforeEach(async () => {
    _now = new Date();
    _dto = {
      name: 'test',
      email: 'test@test.test',
      avatar: 'test',
      createdAt: _now,
    };
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
        } as DataModuleOptions),
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
      providers: [UserService],
    }).compile();

    _userService = _moduleRef.get<UserService>(UserService);
  });

  afterEach(async () => {
    await _moduleRef?.close();
  });

  describe('getOrCreate', () => {
    it('returns the user', async () => {
      const _expected = {
        id: expect.any(String),
        name: _dto.name,
        email: _dto.email,
        avatar: _dto.avatar,
        createdAt: expect.any(Date),
        role: 'user',
      } as Partial<User>;

      const _result = await _userService.getOrCreate(_dto as any);

      expect(_result).toMatchObject(_expected);
    });
  });

  describe('me', () => {
    it('returns the user by email with relations', async () => {
      const _user = await _userService.getOrCreate(_dto as any);

      expect(_user).toBeDefined();

      const _result = await _userService.me(_user.email);

      const _expected: SharedUserDto = {
        name: _user.name,
        email: _user.email,
        avatar: _user.avatar,
        role: _user.role,
        createdAt: _user.createdAt,
      };

      expect(_result).toMatchObject(_expected);
    });
  });
});
