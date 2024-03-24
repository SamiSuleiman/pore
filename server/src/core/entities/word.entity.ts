import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Definition } from './definition.entity';
import { Example } from './example.entity';
import { Link } from './link.entity';
import { Source } from './source.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  content: string;

  @Column({ type: 'varchar', length: 60 })
  language: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.words, { onDelete: 'CASCADE' })
  user: User;

  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.words)
  tags: Tag[];

  @JoinTable()
  @ManyToMany(() => Link, (link) => link.words)
  links: Link[];

  @Column({ type: 'uuid', nullable: true })
  sourceId: string | null;

  @ManyToOne(() => Source, (source) => source.words, { onDelete: 'SET NULL' })
  source: Source | null;

  @JoinTable()
  @OneToMany(() => Definition, (definition) => definition.word)
  definitions: Definition[];

  @JoinTable()
  @OneToMany(() => Example, (example) => example.word)
  examples: Example[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
