import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { GenderEnum } from './enums';

@Entity('users', { schema: 'accounts' })
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  full_name!: string;

  @Column({ type: 'date', default: '1970-01-01' })
  birth_date!: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    enumName: 'gender_enum',
    default: GenderEnum.MALE,
  })
  gender!: GenderEnum;

  @Column({ type: 'text', nullable: true })
  avatar_url!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToOne(() => Account, (account) => account.user)
  account!: Account;
}
