import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverBankEntity } from './driver-bank.entity';
import { EDriverApprovalStatus, EDriverStatus } from 'src/common/enums/driver.enum';
import { ServiceTypeEntity } from './service-type.entity';
import { DriverEmergencyContactEntity } from './driver-emergency-contact.entity';
import { DriverVehicleEntity } from './driver-vehicle.entity';
import { AdminEntity } from './admin.entity';

@Entity('drivers')
export class DriverEntity extends BaseEntity {
  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'active_area_id', nullable: true })
  activeAreaId: number;

  @Column({ name: 'temporary_address', nullable: true })
  temporaryAddress: string;

  @Column({ name: 'identity_card_front_id', nullable: true })
  identityCardFrontId: string;

  @Column({ name: 'identity_card_back_id', nullable: true })
  identityCardBackId: string;

  @Column({ enum: EDriverStatus, default: EDriverStatus.Active })
  status: EDriverStatus;

  @Column({ enum: EDriverApprovalStatus, default: EDriverApprovalStatus.Draft })
  approvalStatus: EDriverApprovalStatus;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: number;

  @Column({ name: 'approved_note', nullable: true })
  approvedNote: string;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @OneToMany(() => DriverBankEntity, (driverBank) => driverBank.driver, { cascade: true })
  banks: DriverBankEntity[];

  @ManyToMany(() => ServiceTypeEntity, (serviceType) => serviceType.id, { cascade: true })
  @JoinTable({
    name: 'driver_service_types',
    joinColumn: { name: 'driver_id' },
    inverseJoinColumn: { name: 'service_type_id' },
  })
  serviceTypes: ServiceTypeEntity[];

  @OneToMany(() => DriverEmergencyContactEntity, (emergencyContact) => emergencyContact.driver, { cascade: true })
  emergencyContacts: DriverEmergencyContactEntity[];

  @OneToOne(() => DriverVehicleEntity, (vehicle) => vehicle.driver, { cascade: true })
  vehicle: DriverVehicleEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;
}
