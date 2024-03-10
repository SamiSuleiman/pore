import { DataSource } from 'typeorm';
import { Definition } from './core/entities/definition.entity';
import { Example } from './core/entities/example.entity';
import { Link } from './core/entities/link.entity';
import { Source } from './core/entities/source.entity';
import { Tag } from './core/entities/tag.entity';
import { User } from './core/entities/user.entity';
import { Word } from './core/entities/word.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] as string, 10),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],

  entities: [Definition, Example, Link, Source, Tag, User, Word],
});
