import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { FileEntity } from './file.entity';
import { BaseEntity } from './base.entity';
import { UniformSizeEntity } from './uniform-size.entity';

@Entity('driver_uniforms')
export class DriverUniformEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @ManyToMany(() => FileEntity, (file) => file.id)
  @JoinTable({
    name: 'driver_uniform_images',
    joinColumn: { name: 'driver_uniform_id' },
    inverseJoinColumn: { name: 'file_id' },
  })
  uniformImages: FileEntity[];

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'contract_file_id', nullable: true })
  contractFileId: string;

  @ManyToMany(() => UniformSizeEntity, (size) => size.id)
  @JoinTable({
    name: 'driver_uniform_sizes',
    joinColumn: { name: 'driver_uniform_id' },
    inverseJoinColumn: { name: 'driver_uniform_size_id' },
  })
  sizes: UniformSizeEntity[];

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'contract_file_id' })
  contractFile: FileEntity;
}
