import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('activity_logs', { schema: 'logs' })
@Index('idx_activity_account', ['account_uid'])
export class ActivityLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  account_uid!: string;

  @Column({ type: 'varchar', length: 255 })
  action!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'varchar', length: 50 })
  ip_address!: string;

  @Column({ type: 'text', nullable: true })
  user_agent!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ManyToOne(() => Account, (account) => account.activity_logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_activity_account',
  })
  account!: Account;
}
