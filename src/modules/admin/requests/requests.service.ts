import { Injectable } from '@nestjs/common';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { RequestTypeEntity } from 'src/database/entities/request-type.entity';
import { ProductsService } from '../products/products.service';
import { EProductApprovalStatus, ERequestStatus, ERequestType } from 'src/common/enums';
import { MerchantRequestEntity } from 'src/database/entities/merchant-request.entity';
import { NotificationsService as MerchantNotificationsService } from 'src/modules/merchant/notifications/notifications.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(ProductApprovalEntity)
    private readonly productApprovalRepository: Repository<ProductApprovalEntity>,

    @InjectRepository(DriverRequestEntity)
    private readonly driverRequestRepository: Repository<DriverRequestEntity>,

    @InjectRepository(RequestTypeEntity)
    private readonly requestTypeRepository: Repository<RequestTypeEntity>,

    @InjectRepository(MerchantRequestEntity)
    private readonly merchantRequestRepository: Repository<MerchantRequestEntity>,

    private readonly productsService: ProductsService,
    private readonly merchantNotificationsService: MerchantNotificationsService,
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

      const { storeId, id, name: productName } = product;

      if (productApproval.type === ERequestType.Create) {
        product.approvalStatus = partialEntity.status as unknown as EProductApprovalStatus;
        product.reason = partialEntity.reason;
        await this.productsService.save(product);
      } else if (partialEntity.status === ERequestStatus.Approved) {
        product.name = productApproval.name || productName;
        product.description = productApproval.description || product.description;
        product.imageId = productApproval.imageId || product.imageId;
        await this.productsService.save(product);
      }

      this.merchantNotificationsService.sendProductApproved(storeId, id, productName, productApproval.status);
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

  createMerchantRequestQueryBuilder(alias?: string) {
    return this.merchantRequestRepository.createQueryBuilder(alias);
  }

  async findRequestTypes(options?: FindManyOptions<RequestTypeEntity>) {
    return this.requestTypeRepository.find(options);
  }

  createRequestTypeQueryBuilder(alias?: string) {
    return this.requestTypeRepository.createQueryBuilder(alias);
  }

  async saveRequestType(entity: DeepPartial<RequestTypeEntity>) {
    return this.requestTypeRepository.save(entity);
  }

  async findOneRequestType(options: FindOneOptions<RequestTypeEntity>) {
    return this.requestTypeRepository.findOne(options);
  }

  async removeRequestType(entity: RequestTypeEntity) {
    return this.requestTypeRepository.softRemove(entity);
  }
}
