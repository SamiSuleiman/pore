import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResDto } from '../core/auth.model';
import { UserService } from '../user/user.service';
import { User, UserDto } from '../core/entities/user.entity';

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

  async getLoginData(profile: any) {
    const _email = profile.emails?.[0].value;
    const _name = profile.displayName ?? profile.username;
    const _avatar = profile.photos?.[0].value ?? '';

    if (!_email) throw new Error('No email found');

    const _loginRes = await this.login({
      email: _email,
      name: _name,
      avatar: _avatar,
      createdAt: new Date(),
    });

    return JSON.stringify(_loginRes);
  }
}
