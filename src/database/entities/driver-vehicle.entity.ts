import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_vehicles')
export class DriverVehicleEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @ManyToMany(() => FileEntity, (file) => file.id)
  @JoinTable({
    name: 'driver_vehicle_images',
    joinColumn: { name: 'driver_vehicle_id' },
    inverseJoinColumn: { name: 'file_id' },
  })
  vehicleImages: FileEntity[];

  @Column({ name: 'license_plate_image_id', nullable: true })
  licensePlateImageId: string;

  @Column({ name: 'driver_license_front_image_id', nullable: true })
  driverLicenseFrontImageId: string;

  @Column({ name: 'driver_license_back_image_id', nullable: true })
  driverLicenseBackImageId: string;

  @Column({ name: 'vehicle_registration_front_image_id', nullable: true })
  vehicleRegistrationFrontImageId: string;

  @Column({ name: 'vehicle_registration_back_image_id', nullable: true })
  vehicleRegistrationBackImageId: string;

  @OneToOne(() => DriverEntity, (driver) => driver.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'license_plate_image_id' })
  licensePlateImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'driver_license_front_image_id' })
  driverLicenseFrontImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'driver_license_back_image_id' })
  driverLicenseBackImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'vehicle_registration_front_image_id' })
  vehicleRegistrationFrontImage: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'vehicle_registration_back_image_id' })
  vehicleRegistrationBackImage: FileEntity;
}
