import { Module } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { ReviewTemplatesController } from './review-templates.controller';

@Module({
  controllers: [ReviewTemplatesController],
  providers: [ReviewTemplatesService],
})
export class ReviewTemplatesModule {}
