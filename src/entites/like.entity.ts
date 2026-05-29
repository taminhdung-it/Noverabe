import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { StoryTypeEnum } from './enums';

@Entity('likes', { schema: 'interactions' })
export class Like {
  @PrimaryColumn({ type: 'bigint' })
  chapter_id!: string;

  @PrimaryColumn({
    type: 'enum',
    enum: StoryTypeEnum,
    enumName: 'story_type_enum',
  })
  chapter_type!: StoryTypeEnum;

  @PrimaryColumn({ type: 'uuid' })
  account_uid!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Account, (account) => account.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_like_account',
  })
  account!: Account;
}
