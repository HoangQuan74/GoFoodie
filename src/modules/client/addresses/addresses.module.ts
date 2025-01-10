import { forwardRef, Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAddressEntity } from 'src/database/entities/client-address.entity';
import { ClientModule } from '../client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientAddressEntity]), forwardRef(() => ClientModule)],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
