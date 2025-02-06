import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('distances')
export class DistanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'origin_lat', type: 'float' })
  originLat: number;

  @Column({ name: 'origin_long', type: 'float' })
  originLong: number;

  @Column({ name: 'destination_lat', type: 'float' })
  destinationLat: number;

  @Column({ name: 'destination_long', type: 'float' })
  destinationLong: number;

  // @Column({ name: 'distance_text' })
  // distanceText: string;

  @Column({ name: 'distance_value' })
  distanceValue: number;

  // @Column({ name: 'duration_text' })
  // durationText: string;

  @Column({ name: 'duration_value' })
  durationValue: number;
}
