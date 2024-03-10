import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataModuleOptions } from './data.mode';
import { createDatabase, dropDatabase } from 'typeorm-extension';

@Module({})
export class DataModule {
  static forRoot(dataModuleOptions?: DataModuleOptions): DynamicModule {
    return {
      module: DataModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (
            configService: ConfigService,
          ): Promise<TypeOrmModuleOptions> => {
            console.log(process.env);
            const _IS_DEV_MODE = configService.get('NODE_ENV') === 'dev';

            const _options = {
              type: configService.getOrThrow<'mysql' | 'sqlite'>('DB_TYPE'),
              host: configService.getOrThrow<string>('DB_HOST'),
              port: configService.getOrThrow<number>('DB_PORT'),
              username: configService.getOrThrow<string>('DB_USERNAME'),
              password: configService.getOrThrow<string>('DB_PASS'),
              database: configService.getOrThrow<string>('DB_NAME'),
              synchronize: dataModuleOptions?.synchronize ?? false,
              autoLoadEntities: dataModuleOptions?.autoLoadEntities ?? true,
              logging: dataModuleOptions?.logging ?? true,
              migrations: ['../../dist/data/migrations/*.js'],
              migrationsRun: dataModuleOptions?.migrationsRun ?? true,
              dropSchema:
                dataModuleOptions?.dropSchema ?? _IS_DEV_MODE ? true : false,
            };

            if (!dataModuleOptions) {
              if (_IS_DEV_MODE)
                await dropDatabase({
                  ifExist: true,
                  options: _options,
                });

              await createDatabase({
                ifNotExist: true,
                options: _options,
              });
            }

            return _options;
          },
        }),
      ],
    };
  }

  static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    return {
      module: DataModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
