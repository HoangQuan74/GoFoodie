import { Injectable } from '@nestjs/common';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(ProductApprovalEntity)
    private readonly productApprovalRepository: Repository<ProductApprovalEntity>,
  ) {}

  createProductApprovalQueryBuilder(alias?: string) {
    return this.productApprovalRepository.createQueryBuilder(alias);
  }

  async saveProductApproval(entity: ProductApprovalEntity) {
    return this.productApprovalRepository.save(entity);
  }

  async findOneProductApproval(options: FindOneOptions<ProductApprovalEntity>) {
    return this.productApprovalRepository.findOne(options);
  }
}
