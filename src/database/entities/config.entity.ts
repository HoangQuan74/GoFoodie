import { EConfigType } from 'src/common/enums/config.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configs')
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key' })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'enum', enum: EConfigType })
  type: EConfigType;
}
