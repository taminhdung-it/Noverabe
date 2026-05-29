import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ComicChapter } from './comic-chapter.entity';

@Entity('comic_chapter_contents', { schema: 'stories' })
export class ComicChapterContent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'integer' })
  position!: number;

  @Column({ type: 'text' })
  image_url!: string;

  @Column({ type: 'bigint' })
  chapter_id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => ComicChapter, (chapter) => chapter.contents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'chapter_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_comic_content_chapter',
  })
  chapter!: ComicChapter;
}
