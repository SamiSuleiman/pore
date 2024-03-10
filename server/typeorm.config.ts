import * as dotenv from 'dotenv';
import { Definition } from 'src/core/entities/definition.entity';
import { Example } from 'src/core/entities/example.entity';
import { Link } from 'src/core/entities/link.entity';
import { Source } from 'src/core/entities/source.entity';
import { Tag } from 'src/core/entities/tag.entity';
import { User } from 'src/core/entities/user.entity';
import { Word } from 'src/core/entities/word.entity';
import { DataSource } from 'typeorm';

dotenv.config({ path: './.env' });
console.log(process.env['DB_HOST']);
export default new DataSource({
  type: 'mariadb',
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] as string, 10),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],

  entities: [Definition, Example, Link, Source, Tag, User, Word],
});
