import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { JwtPayload } from 'src/core/auth.model';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { Roles } from 'src/core/guards/roles.decorator';
import { UpsertDefinitionDto } from '../definition.dto';

@Roles('admin', 'user')
@UseGuards(LoggedInGuard)
@Controller('definitions')
export class DefinitionController {
  constructor(private readonly definitionService: DefinitionService) {}

  @Post()
  async create(
    @Query('wordId') wordId: string,
    @Body() body: UpsertDefinitionDto,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.definitionService.create(body, wordId, req.user.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('wordId') wordId: string,
    @Body() body: UpsertDefinitionDto,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.definitionService.update(id, body, wordId, req.user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('wordId') wordId: string,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.definitionService.remove(id, wordId, req.user.sub);
  }
}
