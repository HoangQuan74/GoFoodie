import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { CreateReviewTemplateDto } from './dto/create-review-template.dto';
import { QueryReviewTemplateDto } from './dto/query-review-template.dto';
import { In, Not } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@Controller('review-templates')
@ApiTags('Review Templates')
export class ReviewTemplatesController {
  constructor(private readonly reviewTemplatesService: ReviewTemplatesService) {}

  @Get()
  find(@Query() query: QueryReviewTemplateDto) {
    const { type, isFiveStar } = query;
    return this.reviewTemplatesService.find({ where: { type, isFiveStar } });
  }

  @Post()
  async create(@Body() createReviewTemplateDto: CreateReviewTemplateDto) {
    const { items, type, isFiveStar } = createReviewTemplateDto;

    const reviewIds = items.map((item) => item.id).filter((id) => id);
    await this.reviewTemplatesService.delete({ id: Not(In(reviewIds)), type, isFiveStar });

    for (const item of items) {
      await this.reviewTemplatesService.save({ ...item, type, isFiveStar });
    }
  }
}
