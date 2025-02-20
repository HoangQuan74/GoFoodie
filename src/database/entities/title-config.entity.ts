import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TitleEntity } from './title.entity';
import { ServiceTypeEntity } from './service-type.entity';
import { EAppType } from 'src/common/enums/config.enum';

@Entity('title_configs')
export class TitleConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'app_type', type: 'enum', enum: EAppType })
  type: EAppType;

  @OneToMany(() => TitleEntity, (title) => title.titleConfig, { cascade: true })
  driverTitles: TitleEntity[];

  @ManyToMany(() => ServiceTypeEntity, (serviceType) => serviceType.id)
  @JoinTable({
    name: 'title_config_service_type',
    joinColumn: { name: 'title_config_id' },
    inverseJoinColumn: { name: 'service_type_id' },
  })
  serviceTypes: ServiceTypeEntity[];
}
