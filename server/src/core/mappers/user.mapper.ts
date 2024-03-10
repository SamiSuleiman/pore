import { UserDto } from '../../user/user.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  private constructor() {}

  static toDto(user: User): UserDto {
    return {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
