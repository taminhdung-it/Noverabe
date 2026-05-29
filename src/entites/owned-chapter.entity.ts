import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { StoryTypeEnum } from './enums';

@Entity('owned_chapters', { schema: 'stories' })
export class OwnedChapter {
  @PrimaryColumn({ type: 'uuid' })
  account_uid!: string;

  @PrimaryColumn({ type: 'bigint' })
  chapter_id!: string;

  @PrimaryColumn({
    type: 'enum',
    enum: StoryTypeEnum,
    enumName: 'story_type_enum',
  })
  chapter_type!: StoryTypeEnum;

  @CreateDateColumn({ type: 'timestamp' })
  owned_at!: Date;

  @ManyToOne(() => Account, (account) => account.owned_chapters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_owned_account',
  })
  account!: Account;
}
