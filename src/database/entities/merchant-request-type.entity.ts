import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('merchant_request_types')
export class MerchantRequestType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
