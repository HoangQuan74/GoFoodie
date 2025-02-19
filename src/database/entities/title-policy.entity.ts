import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TitleEntity } from './title.entity';
import { ETitlePolicyType, ETitlePolicyFrequency } from 'src/common/enums';

@Entity('title_policies')
export class TitlePolicyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  condition: string;

  @Column()
  point: number;

  @Column()
  type: ETitlePolicyType;

  @Column()
  frequency: ETitlePolicyFrequency;

  @ManyToOne(() => TitlePolicyEntity, (policy) => policy.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  driverTitle: TitleEntity;
}
