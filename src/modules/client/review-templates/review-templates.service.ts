import { Injectable } from '@nestjs/common';
import { CreateReviewTemplateDto } from './dto/create-review-template.dto';
import { UpdateReviewTemplateDto } from './dto/update-review-template.dto';

@Injectable()
export class ReviewTemplatesService {
  create(createReviewTemplateDto: CreateReviewTemplateDto) {
    return 'This action adds a new reviewTemplate';
  }

  findAll() {
    return `This action returns all reviewTemplates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reviewTemplate`;
  }

  update(id: number, updateReviewTemplateDto: UpdateReviewTemplateDto) {
    return `This action updates a #${id} reviewTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} reviewTemplate`;
  }
}
