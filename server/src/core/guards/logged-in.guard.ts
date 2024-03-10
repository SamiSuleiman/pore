import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResDto } from '../auth.model';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const _req = context.switchToHttp().getRequest();
    const _token = this.exteatTokenFromCookie(_req);

    if (!_token) throw new UnauthorizedException();

    try {
      const _payload = await this.jwtService.verifyAsync(_token.accessToken);
      _req['user'] = _payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_type, _token] =
      (
        request.headers as Headers & { authorization: string }
      ).authorization?.split(' ') ?? [];

    return _type === 'Bearer' ? _token : undefined;
  }

  private exteatTokenFromCookie(
    req: Request & { cookies: Record<string, string> },
  ): LoginResDto {
    return JSON.parse(req.cookies['PORE_TOKENS']);
  }
}
