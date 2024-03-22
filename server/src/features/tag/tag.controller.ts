import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtPayload } from 'src/core/auth.model';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { Roles } from 'src/core/guards/roles.decorator';
import { TagPreviewDto, UpsertTagDto } from './tag.dto';
import { List } from '../model';

@Roles('admin', 'user')
@UseGuards(LoggedInGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<List<TagPreviewDto>> {
    return await this.tagService.findAll(req.user.sub, 0);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<TagPreviewDto> {
    return await this.tagService.findOne(id, req.user.sub);
  }

  @Post()
  async create(
    @Req() req: Express.Request & { user: JwtPayload },
    @Body() body: UpsertTagDto,
  ): Promise<void> {
    await this.tagService.create(body, req.user.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Express.Request & { user: JwtPayload },
    @Body() body: UpsertTagDto,
  ): Promise<void> {
    await this.tagService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.tagService.remove(id, req.user.sub);
  }
}
