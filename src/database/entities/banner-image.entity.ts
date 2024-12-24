import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { BannerEntity } from './banner.entity';
import { EBannerLinkType } from 'src/common/enums';

@Entity('banner_images')
export class BannerImageEntity extends BaseEntity {
  @Column({ name: 'banner_id' })
  bannerId: string;

  @Column()
  imageId: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ name: 'link_type', type: 'enum', enum: EBannerLinkType })
  linkType: EBannerLinkType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => BannerEntity, (banner) => banner.images, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'banner_id' })
  banner: BannerEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;
}
