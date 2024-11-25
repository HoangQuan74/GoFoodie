import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
