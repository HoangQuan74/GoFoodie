import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FileEntity } from './file.entity';
import { TitlePolicyEntity } from './title-policy.entity';
import { TitleConfigEntity } from './title-config.entity';
import { ETitleIconPosition } from 'src/common/enums';

@Entity('titles')
export class TitleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title_config_id' })
  titleConfigId: number;

  @Column({ default: true })
  status: boolean;

  @Column()
  title: string;

  @Column({ name: 'benefit_id', default: 1 })
  benefitId: number;

  @Column()
  level: number;

  @Column()
  point: number;

  @Column()
  description: string;

  @Column({ name: 'icon_id' })
  iconId: string;

  @Column({ name: 'icon_position' })
  iconPosition: ETitleIconPosition;

  @ManyToOne(() => FileEntity, (file) => file.id, { onDelete: 'CASCADE' })
  icon: FileEntity;

  @OneToMany(() => TitlePolicyEntity, (policy) => policy.title, { cascade: true })
  policies: TitlePolicyEntity[];

  @ManyToOne(() => TitleConfigEntity, (config) => config.id, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'title_config_id' })
  titleConfig: TitleConfigEntity;
}
