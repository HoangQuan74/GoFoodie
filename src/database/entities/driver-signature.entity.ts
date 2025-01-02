// driver-signature.entity
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { FileEntity } from './file.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_signatures')
export class DriverSignatureEntity {
  @PrimaryColumn({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'signature_image_id' })
  signatureImageId: string;

  @OneToOne(() => DriverEntity, (driver) => driver.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @OneToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'signature_image_id' })
  signatureImage: FileEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
