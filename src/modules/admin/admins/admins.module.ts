import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/database/entities/admin.entity';
import { AdminOtpEntity } from 'src/database/entities/admin-otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, AdminOtpEntity])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
