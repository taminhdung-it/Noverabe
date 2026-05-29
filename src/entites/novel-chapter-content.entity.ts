import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NovelChapter } from './novel-chapter.entity';

@Entity('novel_chapter_contents', { schema: 'stories' })
export class NovelChapterContent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'bigint', unique: true })
  chapter_id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToOne(() => NovelChapter, (chapter) => chapter.content, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'chapter_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_novel_content_chapter',
  })
  chapter!: NovelChapter;
}
