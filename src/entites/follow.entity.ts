import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('follows', { schema: 'interactions' })
export class Follow {
  @PrimaryColumn({ type: 'uuid' })
  author_uid!: string;

  @PrimaryColumn({ type: 'uuid' })
  follower_uid!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Account, (account) => account.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_follow_author',
  })
  author!: Account;

  @ManyToOne(() => Account, (account) => account.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'follower_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_follow_follower',
  })
  follower!: Account;
}
