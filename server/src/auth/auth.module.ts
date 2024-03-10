import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from 'process';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './github.strategy';
import { LoggedInGuard } from '../core/guards/logged-in.guard';

@Module({
  imports: [
    // UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: env['CORE_JWT_SECRET'],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, LoggedInGuard],
})
export class AuthModule {}
