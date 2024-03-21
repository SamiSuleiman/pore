import {
  Body,
  Controller,
  Get,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginResDto } from '../core/auth.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.configService.getOrThrow('CLIENT_BASE_URL');
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  authWithGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @Redirect(`${process.env['CLIENT_BASE_URL']}`)
  async googleCallBack(@Req() req: Express.Request): Promise<{ url: string }> {
    const _data = await this.authService.getLoginData(req.user);
    return { url: `${process.env['CLIENT_BASE_URL']}/?data=${_data}` };
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  authWithGithub() {}

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  @Redirect(`${process.env['CLIENT_BASE_URL']}`)
  async githubCallBack(@Req() req: Express.Request): Promise<{ url: string }> {
    const _data = await this.authService.getLoginData(req.user);
    return { url: `${process.env['CLIENT_BASE_URL']}/?data=${_data}` };
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request & { cookies: { PORE_TOKENS: string } },
  ): Promise<LoginResDto> {
    const _tokens: LoginResDto = JSON.parse(req.cookies['PORE_TOKENS']);
    if (!_tokens) throw new Error('No tokens found');

    return await this.authService.refresh(_tokens.refreshToken);
  }

  @Get('verify')
  async verify(@Body() verifyReq: { accessToken: string }) {
    return await this.authService.verify(verifyReq.accessToken);
  }
}
