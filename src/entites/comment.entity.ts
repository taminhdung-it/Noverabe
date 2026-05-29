import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { StoryTypeEnum } from './enums';

@Entity('comments', { schema: 'interactions' })
export class Comment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint' })
  chapter_id!: string;

  @Column({
    type: 'enum',
    enum: StoryTypeEnum,
    enumName: 'story_type_enum',
  })
  chapter_type!: StoryTypeEnum;

  @Column({ type: 'uuid' })
  account_uid!: string;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Account, (account) => account.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_comment_account',
  })
  account!: Account;
}
