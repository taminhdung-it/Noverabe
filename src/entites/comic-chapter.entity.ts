import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ComicChapterContent } from './comic-chapter-content.entity';
import { Story } from './story.entity';

@Entity('comic_chapters', { schema: 'stories' })
@Index('idx_comic_story', ['story_id'])
export class ComicChapter {
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

  @Column({ type: 'jsonb', nullable: true })
  keywords!: unknown;

  @Column({ type: 'bigint' })
  category_id!: string;

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

  @ManyToOne(() => Category, (category) => category.comic_chapters)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_comic_category',
  })
  category!: Category;

  @ManyToOne(() => Story, (story) => story.comic_chapters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'story_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_comic_story',
  })
  story!: Story;

  @OneToMany(() => ComicChapterContent, (content) => content.chapter)
  contents!: ComicChapterContent[];
}
