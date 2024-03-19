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
import { WordService } from './word.service';
import { Roles } from 'src/core/guards/roles.decorator';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { AddWordDto, UpdateWordDto, WordDto, WordPreviewDto } from './word.dto';
import { JwtPayload } from 'src/core/auth.model';

@Roles('admin', 'user')
@UseGuards(LoggedInGuard)
@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get()
  async findAll(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<WordPreviewDto[]> {
    return await this.wordService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<WordDto> {
    return await this.wordService.findOne(id, req.user.sub);
  }

  @Post()
  async create(
    @Body() body: AddWordDto,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<void> {
    await this.wordService.create(body, req.user.sub);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateWordDto,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<void> {
    await this.wordService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<void> {
    await this.wordService.remove(id, req.user.sub);
  }
}
