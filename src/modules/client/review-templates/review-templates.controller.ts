import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewTemplatesService } from './review-templates.service';
import { CreateReviewTemplateDto } from './dto/create-review-template.dto';
import { UpdateReviewTemplateDto } from './dto/update-review-template.dto';

@Controller('review-templates')
export class ReviewTemplatesController {
  constructor(private readonly reviewTemplatesService: ReviewTemplatesService) {}

  @Post()
  create(@Body() createReviewTemplateDto: CreateReviewTemplateDto) {
    return this.reviewTemplatesService.create(createReviewTemplateDto);
  }

  @Get()
  findAll() {
    return this.reviewTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewTemplateDto: UpdateReviewTemplateDto) {
    return this.reviewTemplatesService.update(+id, updateReviewTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewTemplatesService.remove(+id);
  }
}
