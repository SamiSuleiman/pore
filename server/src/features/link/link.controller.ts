import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { JwtPayload } from 'src/core/auth.model';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { Roles } from 'src/core/guards/roles.decorator';
import { LinkDto, LinkPreviewDto, UpsertLinkDto } from './link.dto';
import { FilterDto, List } from '../model';

@Roles('admin', 'user')
@UseGuards(LoggedInGuard)
@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  async findAll(
    @Req() req: Express.Request & { user: JwtPayload },
    @Query('filter') filter: string,
  ): Promise<List<LinkPreviewDto>> {
    const _parsedFilter = JSON.parse(filter) as FilterDto;
    const _page = _parsedFilter.page ? _parsedFilter.page : 0;
    return await this.linkService.findAll(req.user.sub, _page);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<LinkDto> {
    return await this.linkService.findOne(id, req.user.sub);
  }

  @Post()
  async create(
    @Req() req: Express.Request & { user: JwtPayload },
    @Body() body: UpsertLinkDto,
  ): Promise<void> {
    await this.linkService.create(body, req.user.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Express.Request & { user: JwtPayload },
    @Body() body: UpsertLinkDto,
  ): Promise<void> {
    await this.linkService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Express.Request & { user: JwtPayload },
  ): Promise<void> {
    await this.linkService.remove(id, req.user.sub);
  }
}
