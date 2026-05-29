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
import { Account } from './account.entity';
import { ComicChapter } from './comic-chapter.entity';
import { NovelChapter } from './novel-chapter.entity';
import { StoryTypeEnum } from './enums';

@Entity('stories', { schema: 'stories' })
@Index('idx_story_author', ['author_uid'])
export class Story {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  author_uid!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alternative_title!: string;

  @Column({ type: 'text', nullable: true })
  thumbnail_url!: string;

  @Column({ type: 'text', nullable: true })
  cover_url!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({
    type: 'enum',
    enum: StoryTypeEnum,
    enumName: 'story_type_enum',
    default: StoryTypeEnum.COMIC,
  })
  story_type!: StoryTypeEnum;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Account, (account) => account.stories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_story_author',
  })
  author!: Account;

  @OneToMany(() => ComicChapter, (chapter) => chapter.story)
  comic_chapters!: ComicChapter[];

  @OneToMany(() => NovelChapter, (chapter) => chapter.story)
  novel_chapters!: NovelChapter[];
}
