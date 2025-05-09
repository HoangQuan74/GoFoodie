import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EServiceGroupStatus } from '../../common/enums';

@Entity('service_groups')
export class ServiceGroupEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EServiceGroupStatus, default: EServiceGroupStatus.Active })
  status: EServiceGroupStatus;
}
