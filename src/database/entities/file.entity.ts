import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column()
  path: string;
}
