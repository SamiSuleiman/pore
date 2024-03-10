import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResDto } from '../core/auth.model';
import { UserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { User } from '../core/entities/user.entity';

@Injectable()
export class AuthService {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async login(userDto: UserDto): Promise<LoginResDto> {
    return await this.signTokens(await this.userService.getOrCreate(userDto));
  }

  async refresh(refreshToken: string) {
    let _tokenPayload: JwtPayload;

    try {
      _tokenPayload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch (error) {
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);
    }

    if (_tokenPayload.type !== 'refresh')
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);

    return await this.signTokens(
      await this.userService.usersRepo.findOneByOrFail({
        email: _tokenPayload.email,
      }),
    );
  }

  async verify(accessToken: string) {
    let _tokenPayload: JwtPayload;

    try {
      _tokenPayload =
        await this.jwtService.verifyAsync<JwtPayload>(accessToken);
    } catch (error) {
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);
    }

    if (_tokenPayload.type !== 'access')
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);

    return await this.userService.usersRepo.findOneByOrFail({
      email: _tokenPayload.email,
    });
  }

  async signTokens(user: User) {
    return {
      accessToken: await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          type: 'access',
        },
        { expiresIn: '30 days' },
      ),
      refreshToken: await this.jwtService.signAsync(
        {
          sub: user.id,
          type: 'refresh',
        },
        { expiresIn: '90 days' },
      ),
    };
  }
}
