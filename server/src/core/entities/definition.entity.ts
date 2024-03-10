import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from './word.entity';

@Entity()
export class Definition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 210 })
  content: string;

  @Column({ type: 'uuid' })
  wordId: string;

  @ManyToOne(() => Word, (word) => word.definitions, { onDelete: 'CASCADE' })
  word: Word;
}
