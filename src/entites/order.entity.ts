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
import { PaymentStatusEnum } from './enums';
import { Transaction } from './transaction.entity';

@Entity('orders', { schema: 'orders' })
@Index('idx_order_account', ['account_uid'])
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total_amount!: string;

  @Column({ type: 'uuid' })
  account_uid!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    enumName: 'payment_status_enum',
    default: PaymentStatusEnum.PENDING,
  })
  payment_status!: PaymentStatusEnum;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Account, (account) => account.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_uid',
    referencedColumnName: 'uid',
    foreignKeyConstraintName: 'fk_order_account',
  })
  account!: Account;

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions!: Transaction[];
}
