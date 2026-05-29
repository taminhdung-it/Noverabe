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
import { StoryTypeEnum } from './enums';
import { Order } from './order.entity';

@Entity('transactions', { schema: 'logs' })
@Index('idx_transaction_account', ['account_uid'])
export class Transaction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  account_uid!: string;

  @Column({ type: 'bigint' })
  chapter_id!: string;

  @Column({
    type: 'enum',
    enum: StoryTypeEnum,
    enumName: 'story_type_enum',
  })
  chapter_type!: StoryTypeEnum;

  @Column({ type: 'bigint' })
  order_id!: string;

  @Column({ type: 'bigint', nullable: true })
  payment_id!: string;

  @Column({ type: 'varchar', length: 255 })
  transaction_name!: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_transaction_account',
  })
  account!: Account;

  @ManyToOne(() => Order, (order) => order.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_transaction_order',
  })
  order!: Order;
}
