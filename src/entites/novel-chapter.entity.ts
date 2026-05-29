import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NovelChapterContent } from './novel-chapter-content.entity';
import { Story } from './story.entity';

@Entity('novel_chapters', { schema: 'stories' })
@Index('idx_novel_story', ['story_id'])
export class NovelChapter {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'integer' })
  chapter_number!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  thumbnail_url!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'bigint' })
  story_id!: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  price!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Story, (story) => story.novel_chapters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'story_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_novel_story',
  })
  story!: Story;

  @OneToOne(() => NovelChapterContent, (content) => content.chapter)
  content!: NovelChapterContent;
}
