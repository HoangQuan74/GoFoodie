import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';
import { WardsModule } from 'src/modules/wards/wards.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity]), WardsModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
