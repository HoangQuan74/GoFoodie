// driver-emergency-contact.entity
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';
import { RelationshipEntity } from './relationship.entity';

@Entity('driver_emergency_contacts')
export class DriverEmergencyContactEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'relationship_id', nullable: true })
  relationshipId: number;

  @ManyToOne(() => DriverEntity, (driver) => driver.emergencyContacts, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => RelationshipEntity, (relationship) => relationship.id)
  @JoinColumn({ name: 'relationship_id' })
  relationship: RelationshipEntity;
}
