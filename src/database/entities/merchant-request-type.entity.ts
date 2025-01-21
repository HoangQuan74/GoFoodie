import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchant_request_types')
export class MerchantRequestTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
