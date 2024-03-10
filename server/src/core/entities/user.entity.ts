import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Link } from './link.entity';
import { Source } from './source.entity';
import { Tag } from './tag.entity';
import { Word } from './word.entity';
import { Role } from '../auth.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 60 })
  email: string;

  @Column({ type: 'varchar' })
  avatar: string;

  @Column({ type: 'varchar' })
  role: Role;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Word, (word) => word.user)
  words: Word[];

  @OneToMany(() => Source, (source) => source.user)
  sources: Source[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
