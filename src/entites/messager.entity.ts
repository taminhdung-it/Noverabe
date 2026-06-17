import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('messagers', { schema: 'notifications' })
@Index('idx_messager_sender', ['sender_uid'])
@Index('idx_messager_receiver', ['receiver_uid'])
export class Messager {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  sender_uid!: string;

  @Column({ type: 'uuid' })
  receiver_uid!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'boolean', default: false })
  is_read!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Account, (account) => account.sent_messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'sender_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_messager_sender',
  })
  sender!: Account;

  @ManyToOne(() => Account, (account) => account.received_messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'receiver_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_messager_receiver',
  })
  receiver!: Account;
}
