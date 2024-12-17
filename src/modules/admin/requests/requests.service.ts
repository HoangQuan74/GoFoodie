import { Injectable } from '@nestjs/common';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(ProductApprovalEntity)
    private readonly productApprovalRepository: Repository<ProductApprovalEntity>,

    @InjectRepository(DriverRequestEntity)
    private readonly driverRequestRepository: Repository<DriverRequestEntity>,
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

  async findProductApprovals(options: FindManyOptions<ProductApprovalEntity>) {
    return this.productApprovalRepository.find(options);
  }

  async updateProductApproval(
    criteria: FindOptionsWhere<ProductApprovalEntity>,
    partialEntity: Partial<ProductApprovalEntity>,
  ) {
    return this.productApprovalRepository.update(criteria, partialEntity);
  }

  createDriverRequestQueryBuilder(alias?: string) {
    return this.driverRequestRepository.createQueryBuilder(alias);
  }

  async saveDriverRequest(entity: DriverRequestEntity) {
    return this.driverRequestRepository.save(entity);
  }

  async findOneDriverRequest(options: FindOneOptions<DriverRequestEntity>) {
    return this.driverRequestRepository.findOne(options);
  }

  async findDriverRequests(options: FindManyOptions<DriverRequestEntity>) {
    return this.driverRequestRepository.find(options);
  }

  async updateDriverRequest(
    criteria: FindOptionsWhere<DriverRequestEntity>,
    partialEntity: Partial<DriverRequestEntity>,
  ) {
    return this.driverRequestRepository.update(criteria, partialEntity);
  }
}
