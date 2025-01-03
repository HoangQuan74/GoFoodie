import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { BannerEntity } from './banner.entity';
import { EBannerLinkType } from 'src/common/enums';

@Entity('banner_files')
export class BannerImageEntity extends BaseEntity {
  @Column({ name: 'banner_id' })
  bannerId: string;

  @Column({ name: 'file_id', nullable: true })
  fileId: string;

  @Generated('increment')
  @Column()
  sort: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ name: 'video_thumbnail_id', nullable: true })
  videoThumbnailId: string;

  @Column({ name: 'link_type', type: 'enum', enum: EBannerLinkType })
  linkType: EBannerLinkType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'change_time', nullable: true })
  changeTime: number;

  @Column({ name: 'change_speed', nullable: true })
  changeSpeed: number;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @ManyToOne(() => BannerEntity, (banner) => banner.files, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'banner_id' })
  banner: BannerEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}
