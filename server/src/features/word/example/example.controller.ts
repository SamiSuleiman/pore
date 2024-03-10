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
import { ExampleService } from './example.service';
import { JwtPayload } from 'src/core/auth.model';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { Roles } from 'src/core/guards/roles.decorator';
import { UpsertExampleDto } from '../example.dto';

@Roles('admin', 'user')
@UseGuards(LoggedInGuard)
@Controller('definitions')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  async create(
    @Query('wordId') wordId: string,
    @Body() body: UpsertExampleDto,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.exampleService.create(body, wordId, req.user.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('wordId') wordId: string,
    @Body() body: UpsertExampleDto,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.exampleService.update(id, body, wordId, req.user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('wordId') wordId: string,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.exampleService.remove(id, wordId, req.user.sub);
  }
}
