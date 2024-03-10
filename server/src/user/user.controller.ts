import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../core/auth.model';
import { LoggedInGuard } from '../core/guards/logged-in.guard';
import { Roles } from '../core/guards/roles.decorator';
import { UserService } from './user.service';

@UseGuards(LoggedInGuard)
@Roles('user', 'admin')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@Req() req: Request & { user: JwtPayload }) {
    return await this.userService.me(req.user.email);
  }

  @Get('overview')
  async overview(@Req() req: Request & { user: JwtPayload }) {
    return await this.userService.overview(req.user.email);
  }
}
