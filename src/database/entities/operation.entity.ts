import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('operations')
export class OperationEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  module: string;

  @Column()
  action: string;
}
