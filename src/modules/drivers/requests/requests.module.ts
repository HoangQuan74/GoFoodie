import { forwardRef, Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { DriversModule } from '../drivers.module';
import { RequestTypeEntity } from 'src/database/entities/request-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverRequestEntity, RequestTypeEntity]), forwardRef(() => DriversModule)],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
