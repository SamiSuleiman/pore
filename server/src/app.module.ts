import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { SeedService } from './data/seed/seed.service';
import { WordModule } from './features/word/word.module';
import { SourceModule } from './features/source/source.module';
import { TagModule } from './features/tag/tag.module';
import { LinkModule } from './features/link/link.module';

@Module({
  imports: [
    WordModule,
    SourceModule,
    TagModule,
    LinkModule,
    AuthModule,
    DataModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [SeedService, Logger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedService: SeedService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const _IS_DEV_MODE = this.configService.get('NODE_ENV') === 'dev';
    if (_IS_DEV_MODE) await this.seedService.seed();
  }
}
