import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AdminEntity } from './admin.entity';

@Entity('admin_refresh_tokens')
export class AdminRefreshTokenEntity extends BaseEntity {
  @Column({ name: 'admin_id' })
  adminId: number;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'admin_id' })
  admin: AdminEntity;
}
