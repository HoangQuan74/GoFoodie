import { Controller, Get, Post, Body, Query, UseGuards, ConflictException } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { CreateReviewTemplateDto } from './dto/create-review-template.dto';
import { QueryReviewTemplateDto } from './dto/query-review-template.dto';
import { In, Not } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { EXCEPTIONS } from 'src/common/constants';

@Controller('review-templates')
@ApiTags('Review Templates')
@UseGuards(AuthGuard)
export class ReviewTemplatesController {
  constructor(private readonly reviewTemplatesService: ReviewTemplatesService) {}

  @Get('criteria')
  getReviewCriteria() {
    return this.reviewTemplatesService.getReviewCriteria();
  }

  @Get()
  find(@Query() query: QueryReviewTemplateDto) {
    const { type, isFiveStar } = query;
    return this.reviewTemplatesService.find({ where: { type, isFiveStar }, relations: ['criteria'] });
  }

  @Post()
  async create(@Body() createReviewTemplateDto: CreateReviewTemplateDto) {
    const { items, type, isFiveStar } = createReviewTemplateDto;

    const names = items.map((item) => item.name);
    if (new Set(names).size !== names.length) {
      throw new ConflictException(EXCEPTIONS.NAME_EXISTED);
    }

    const reviewIds = items.map((item) => item.id).filter((id) => id);
    await this.reviewTemplatesService.delete({ id: Not(In(reviewIds)), type, isFiveStar });

    for (const item of items) {
      await this.reviewTemplatesService.save({ ...item, type, isFiveStar });
    }
  }
}
