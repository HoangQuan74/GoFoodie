import { Injectable } from '@nestjs/common';
import { ReviewTemplateEntity } from 'src/database/entities/review-template.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewCriteriaEntity } from 'src/database/entities/review-criteria.entity';

@Injectable()
export class ReviewTemplatesService {
  constructor(
    @InjectRepository(ReviewTemplateEntity)
    private reviewTemplateRepository: Repository<ReviewTemplateEntity>,

    @InjectRepository(ReviewCriteriaEntity)
    private reviewCriteriaRepository: Repository<ReviewCriteriaEntity>,
  ) {}

  async save(entity: Partial<ReviewTemplateEntity>): Promise<ReviewTemplateEntity> {
    return this.reviewTemplateRepository.save(entity);
  }

  async find(options?: FindManyOptions<ReviewTemplateEntity>): Promise<ReviewTemplateEntity[]> {
    return this.reviewTemplateRepository.find(options);
  }

  async delete(criteria: FindOptionsWhere<ReviewTemplateEntity>): Promise<void> {
    await this.reviewTemplateRepository.softDelete(criteria);
  }

  async getReviewCriteria() {
    return this.reviewCriteriaRepository.find();
  }
}
