import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
