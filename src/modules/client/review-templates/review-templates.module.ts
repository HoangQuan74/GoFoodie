import { forwardRef, Module } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { ReviewTemplatesController } from './review-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewTemplateEntity } from 'src/database/entities/review-template.entity';
import { ClientModule } from '../clients/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewTemplateEntity]), forwardRef(() => ClientModule)],
  controllers: [ReviewTemplatesController],
  providers: [ReviewTemplatesService],
})
export class ReviewTemplatesModule {}
