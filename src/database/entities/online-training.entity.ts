import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { EOnlineTrainingType } from 'src/common/enums';

@Entity('online_training')
export class OnlineTrainingEntity extends BaseEntity {
  @Column({ name: 'video_id', nullable: true })
  videoId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ type: 'enum', enum: EOnlineTrainingType })
  type: EOnlineTrainingType;

  @Column({ name: 'test_name' })
  testName: string;

  @Column({ name: 'test_link' })
  testLink: string;

  @Column({ name: 'test_description' })
  testDescription: string;

  @ManyToMany(() => FileEntity, (file) => file.id)
  @JoinTable({
    name: 'online_training_images',
    joinColumn: { name: 'online_training_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  images: FileEntity[];

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'video_id' })
  video: FileEntity;
}
