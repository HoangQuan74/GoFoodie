import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/database/entities/role.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), AdminsModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
