import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityLog } from './activity-log.entity';
import { Comment } from './comment.entity';
import { Follow } from './follow.entity';
import { Like } from './like.entity';
import { Order } from './order.entity';
import { OwnedChapter } from './owned-chapter.entity';
import { Role } from './role.entity';
import { Story } from './story.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { AccountStatusEnum } from './enums';

@Entity('accounts', { schema: 'accounts' })
@Check('chk_account_gold_balance', 'gold_balance >= 0')
export class Account {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  uid!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ type: 'text' })
  password_hash!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number!: string;

  @Column({ type: 'bigint' })
  role_id!: string;

  @Column({ type: 'bigint', unique: true })
  user_id!: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  gold_balance!: string;

  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    enumName: 'account_status_enum',
    default: AccountStatusEnum.OFFLINE,
  })
  status!: AccountStatusEnum;

  @Column({ type: 'bigint', default: 0 })
  token_version!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Role, (role) => role.accounts)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_account_role',
  })
  role!: Role;

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_account_user',
  })
  user!: User;

  @OneToMany(() => Story, (story) => story.author)
  stories!: Story[];

  @OneToMany(() => OwnedChapter, (ownedChapter) => ownedChapter.account)
  owned_chapters!: OwnedChapter[];

  @OneToMany(() => Like, (like) => like.account)
  likes!: Like[];

  @OneToMany(() => Comment, (comment) => comment.account)
  comments!: Comment[];

  @OneToMany(() => Follow, (follow) => follow.author)
  followers!: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following!: Follow[];

  @OneToMany(() => Order, (order) => order.account)
  orders!: Order[];

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.account)
  activity_logs!: ActivityLog[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];
}
