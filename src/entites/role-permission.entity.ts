import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity('role_permissions', { schema: 'roles' })
export class RolePermission {
  @PrimaryColumn({ type: 'bigint' })
  role_id!: string;

  @PrimaryColumn({ type: 'bigint' })
  permission_id!: string;

  @ManyToOne(() => Role, (role) => role.role_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_role_permission_role',
  })
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.role_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'permission_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_role_permission_permission',
  })
  permission!: Permission;
}
