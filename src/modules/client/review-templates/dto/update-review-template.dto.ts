import { PartialType } from '@nestjs/swagger';
import { CreateReviewTemplateDto } from './create-review-template.dto';

export class UpdateReviewTemplateDto extends PartialType(CreateReviewTemplateDto) {}
