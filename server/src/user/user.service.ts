import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserDto, UserOverviewDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { UserMapper } from '../core/mappers/user.mapper';
import { UserDto as SharedUserDto } from '../core/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) public readonly usersRepo: Repository<User>,
  ) {}

  async getOrCreate(user: SharedUserDto): Promise<User> {
    const _existing = await this.usersRepo.findOneBy({ email: user.email });
    return _existing
      ? _existing
      : await this.usersRepo.save(
          this.usersRepo.create({
            ...user,
            role:
              this.configService.get<string>('CORE_OWNER_EMAIL') === user.email
                ? 'admin'
                : 'user',
          }),
        );
  }

  async me(email: string): Promise<UserDto> {
    return UserMapper.toDto(
      await this.usersRepo.findOneOrFail({
        where: { email },
      }),
    );
  }

  async overview(email: string): Promise<UserOverviewDto> {
    const _user = await this.usersRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .leftJoin('user.words', 'words')
      .leftJoin('user.tags', 'tags')
      .leftJoin('user.links', 'links')
      .leftJoin('user.sources', 'sources')
      .loadRelationCountAndMap('user.wordCount', 'user.words')
      .loadRelationCountAndMap('user.tagCount', 'user.tags')
      .loadRelationCountAndMap('user.linkCount', 'user.links')
      .loadRelationCountAndMap('user.sourceCount', 'user.sources')
      .getOneOrFail();

    return {
      name: _user.name,
      email: _user.email,
      avatar: _user.avatar,
      createdAt: _user.createdAt,
      wordCount: (_user as User & { wordCount: number }).wordCount,
      tagCount: (_user as User & { tagCount: number }).tagCount,
      sourceCount: (_user as User & { sourceCount: number }).sourceCount,
      linkCount: (_user as User & { linkCount: number }).linkCount,
    };
  }
}
