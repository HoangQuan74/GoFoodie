import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { QueryReviewTemplateDto } from './dto/query-review-template.dto';

@Controller('review-templates')
@ApiTags('Review Templates')
@UseGuards(AuthGuard)
export class ReviewTemplatesController {
  constructor(private readonly reviewTemplatesService: ReviewTemplatesService) {}

  @Get()
  find(@Query() query: QueryReviewTemplateDto) {
    const { type, isFiveStar } = query;
    return this.reviewTemplatesService.find({ where: { type, isFiveStar } });
  }
}
