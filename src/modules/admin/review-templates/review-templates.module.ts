import { AdminsModule } from './../admins/admins.module';
import { Module } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { ReviewTemplatesController } from './review-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewTemplateEntity } from 'src/database/entities/review-template.entity';
import { ReviewCriteriaEntity } from 'src/database/entities/review-criteria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewTemplateEntity, ReviewCriteriaEntity]), AdminsModule],
  controllers: [ReviewTemplatesController],
  providers: [ReviewTemplatesService],
})
export class ReviewTemplatesModule {}
