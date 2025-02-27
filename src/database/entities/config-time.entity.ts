import { EConfigTime } from 'src/common/enums/config-time.enum';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'config_times' })
export class ConfigTimeEntity extends BaseEntity {
  @PrimaryColumn()
  key: EConfigTime;

  @Column({ name: 'value' })
  value: number;
}
