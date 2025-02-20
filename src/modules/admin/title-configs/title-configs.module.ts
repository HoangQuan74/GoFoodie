import { Module } from '@nestjs/common';
import { DriverTitleConfigsService } from './title-configs.service';
import { DriverTitleConfigsController } from './title-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TitleConfigEntity } from 'src/database/entities/title-config.entity';
import { AdminsModule } from '../admins/admins.module';
import { TitlePolicySanctionEntity } from 'src/database/entities/title-policy-sanction.entity';
import { TitlePolicyCriteriaEntity } from 'src/database/entities/title-policy-criteria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TitleConfigEntity, TitlePolicySanctionEntity, TitlePolicyCriteriaEntity]),
    AdminsModule,
  ],
  controllers: [DriverTitleConfigsController],
  providers: [DriverTitleConfigsService],
})
export class DriverTitleConfigsModule {}
