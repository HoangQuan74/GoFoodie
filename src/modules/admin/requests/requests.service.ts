import { Injectable } from '@nestjs/common';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { ProductsService } from '../products/products.service';
import { EProductApprovalStatus, ERequestStatus, ERequestType } from 'src/common/enums';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(ProductApprovalEntity)
    private readonly productApprovalRepository: Repository<ProductApprovalEntity>,

    @InjectRepository(DriverRequestEntity)
    private readonly driverRequestRepository: Repository<DriverRequestEntity>,

    private readonly productsService: ProductsService,
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
    const productApprovals = await this.productApprovalRepository.find({ where: criteria });

    for (const productApproval of productApprovals) {
      const product = await this.productsService.findOne({ where: { id: productApproval.productId } });
      if (!product) continue;

      if (productApproval.type === ERequestType.Create) {
        product.approvalStatus = partialEntity.status as unknown as EProductApprovalStatus;
        await this.productsService.save(product);
        continue;
      }

      if (partialEntity.status === ERequestStatus.Approved) {
        product.name = productApproval.name;
        product.description = productApproval.description;
        product.imageId = productApproval.imageId;
        await this.productsService.save(product);
      }
    }

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
