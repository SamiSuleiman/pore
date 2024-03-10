export interface DataModuleOptions {
  type?: 'sqlite' | 'mysql';
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  database?: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
  logging: boolean;
  dropSchema: boolean;
  migrationsRun: boolean;
}
