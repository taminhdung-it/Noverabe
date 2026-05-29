import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ComicChapter } from './comic-chapter.entity';

@Entity('categories', { schema: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => ComicChapter, (chapter) => chapter.category)
  comic_chapters!: ComicChapter[];
}
