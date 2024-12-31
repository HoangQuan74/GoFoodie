import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { NoticeEntity } from './notice.entity';

@Entity('notice_types')
export class NoticeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => NoticeEntity, (notice) => notice.type)
  notices: NoticeEntity[];
}
