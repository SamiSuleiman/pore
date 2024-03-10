import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { env } from 'process';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: env['GITHUB_CLIENT_ID'],
      clientSecret: env['GITHUB_CLIENT_SECRET'],
      callbackURL: env['CORE_BASE_URL'] + '/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    _: string,
    __: string,
    profile: Profile,
    done: (err?: Error | null, profile?: Profile) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    done(null, profile);
  }
}
