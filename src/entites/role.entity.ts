import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { RolePermission } from './role-permission.entity';

@Entity('roles', { schema: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  role_permissions!: RolePermission[];

  @OneToMany(() => Account, (account) => account.role)
  accounts!: Account[];
}
