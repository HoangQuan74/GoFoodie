import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewTemplateEntity } from 'src/database/entities/review-template.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ReviewTemplatesService {
  constructor(
    @InjectRepository(ReviewTemplateEntity)
    private reviewTemplateRepository: Repository<ReviewTemplateEntity>,
  ) {}

  async find(options?: FindManyOptions<ReviewTemplateEntity>): Promise<ReviewTemplateEntity[]> {
    return this.reviewTemplateRepository.find(options);
  }
}
