import { Controller, Get, Body, Patch, Query, NotFoundException, UseGuards, Param } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { IdentityQuery } from 'src/common/query';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ERequestStatus } from 'src/common/enums';
import { QueryRequestDto, QueryRequestMerchantDto } from './dto/query-request.dto';
import { Brackets, In } from 'typeorm';

@Controller('requests')
@ApiTags('Quản lý yêu cầu')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Danh sách yêu cầu duyệt sản phẩm' })
  async getProducts(@Query() query: QueryRequestDto) {
    const { page, limit, status, type, productCategoryId, search } = query;
    const { createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo } = query;

    const queryBuilder = this.requestsService
      .createProductApprovalQueryBuilder('approval')
      .select(['approval.id as id', 'approval.code as code', 'approval.status as status', 'approval.type as type'])
      .addSelect(['approval.createdAt as "createdAt"', 'approval.reason as "reason"'])
      .addSelect(['product.code as "productCode"', 'product.price as "productPrice"'])
      .addSelect('COALESCE(approval.name, product.name) as "productName"')
      .addSelect('COALESCE(approval.description, product.description) as "productDescription"')
      .addSelect('COALESCE(approval.imageId, product.imageId) as "productImageId"')
      .addSelect(['store.storeCode as "storeCode"', 'store.name as "storeName"', 'store.id as "storeId"'])
      .addSelect(['category.name as "categoryName"', 'merchant.name as "merchantName"'])
      .addSelect(['processedBy.name as "processedByName"', 'approval.processedAt as "processedAt"'])
      .innerJoin('approval.product', 'product')
      .leftJoin('product.productCategory', 'category')
      .innerJoin('product.store', 'store')
      .innerJoin('approval.merchant', 'merchant')
      .leftJoin('approval.processedBy', 'processedBy')
      .orderBy('approval.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    status && queryBuilder.andWhere('approval.status = :status', { status });
    type && queryBuilder.andWhere('approval.type = :type', { type });
    productCategoryId && queryBuilder.andWhere('product.productCategoryId = :productCategoryId', { productCategoryId });
    createdAtFrom && queryBuilder.andWhere('approval.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('approval.createdAt <= :createdAtTo', { createdAtTo });
    approvedAtFrom && queryBuilder.andWhere('approval.processedAt >= :approvedAtFrom', { approvedAtFrom });
    approvedAtTo && queryBuilder.andWhere('approval.processedAt <= :approvedAtTo', { approvedAtTo });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('approval.code ILIKE :search', { search: `%${search}%` })
            .orWhere('product.code ILIKE :search', { search: `%${search}%` })
            .orWhere('product.name ILIKE :search', { search: `%${search}%` })
            .orWhere('store.storeCode ILIKE :search', { search: `%${search}%` })
            .orWhere('store.name ILIKE :search', { search: `%${search}%` })
            .orWhere('category.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const itemsPromise = queryBuilder.getRawMany();
    const totalPromise = queryBuilder.getCount();

    const countQuery = this.requestsService
      .createProductApprovalQueryBuilder('approval')
      .innerJoin('approval.product', 'product');

    const pendingPromise = countQuery.where(`approval.status = '${ERequestStatus.Pending}'`).getCount();
    const approvedPromise = countQuery.where(`approval.status = '${ERequestStatus.Approved}'`).getCount();
    const rejectedPromise = countQuery.where(`approval.status = '${ERequestStatus.Rejected}'`).getCount();

    const [items, total, pending, approved, rejected] = await Promise.all([
      itemsPromise,
      totalPromise,
      pendingPromise,
      approvedPromise,
      rejectedPromise,
    ]);

    return { items, total, pending, approved, rejected };
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Chi tiết yêu cầu duyệt sản phẩm' })
  async getDetailProductApproval(@Param('id') id: number) {
    const queryBuilder = this.requestsService
      .createProductApprovalQueryBuilder('approval')
      .addSelect(['merchant.id', 'merchant.name'])
      .addSelect(['processedBy.id', 'processedBy.name'])
      .addSelect(['store.id', 'store.storeCode', 'store.name'])
      .addSelect(['category.name'])
      .leftJoin('approval.merchant', 'merchant')
      .leftJoin('approval.processedBy', 'processedBy')
      .leftJoinAndSelect('approval.product', 'product')
      .leftJoin('product.store', 'store')
      .leftJoin('product.productCategory', 'category')
      .leftJoinAndSelect('product.productOptionGroups', 'productOptionGroups')
      .leftJoinAndSelect('product.productWorkingTimes', 'productWorkingTimes')
      .leftJoinAndSelect('productOptionGroups.optionGroup', 'optionGroup')
      .leftJoinAndSelect('productOptionGroups.options', 'options')
      .where('approval.id = :id', { id });

    const request = await queryBuilder.getOne();
    if (!request) throw new NotFoundException();

    return request;
  }

  @Patch('products/approval')
  @ApiOperation({ summary: 'Duyệt yêu cầu duyệt sản phẩm' })
  async productApproval(@Body() { ids }: IdentityQuery, @CurrentUser() user: JwtPayload) {
    const requests = await this.requestsService.findProductApprovals({
      where: { id: In(ids), status: ERequestStatus.Pending },
    });
    if (requests.length !== ids.length) throw new NotFoundException();

    const data = { processedById: user.id, status: ERequestStatus.Approved, processedAt: new Date() };
    await this.requestsService.updateProductApproval({ id: In(ids) }, data);
  }

  @Patch('products/:id/reject')
  @ApiOperation({ summary: 'Từ chối yêu cầu duyệt sản phẩm' })
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string' } } } })
  async productReject(
    @Body() { reason }: { reason: string },
    @CurrentUser() user: JwtPayload,
    @Param('id') id: number,
  ) {
    const request = await this.requestsService.findOneProductApproval({
      where: { id, status: ERequestStatus.Pending },
    });
    if (!request) throw new NotFoundException();

    const data = { processedById: user.id, status: ERequestStatus.Rejected, processedAt: new Date(), reason };
    await this.requestsService.updateProductApproval({ id }, data);
  }

  @Get('drivers')
  @ApiOperation({ summary: 'Danh sách yêu cầu tài xế' })
  async getDrivers(@Query() query: QueryRequestDto) {
    const { page, limit, status, type, createdAtFrom, createdAtTo, search } = query;

    const queryBuilder = this.requestsService
      .createDriverRequestQueryBuilder('request')
      .select(['request.id as id', 'request.code as code', 'request.status as status', 'request.type as type'])
      .addSelect(['request.createdAt as "createdAt"', 'request.name as "name"', 'request.description as "description"'])
      .addSelect(['driver.fullName as "driverName"', 'driver.phoneNumber as "driverPhone"'])
      .addSelect(['processedBy.name as "processedByName"', 'request.processedAt as "processedAt"'])
      .innerJoin('request.driver', 'driver')
      .leftJoin('request.processedBy', 'processedBy')
      .orderBy('request.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    status && queryBuilder.andWhere('request.status = :status', { status });
    type && queryBuilder.andWhere('request.type = :type', { type });
    createdAtFrom && queryBuilder.andWhere('request.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('request.createdAt <= :createdAtTo', { createdAtTo });

    if (search) {
      // queryBuilder.andWhere(
      //   new Brackets((qb) => {
      //     qb.where('request.code ILIKE :search', { search: `%${search}%` })
      //       .orWhere('driver.name ILIKE :search', { search: `%${search}%` })
      //       .orWhere('driver.phone ILIKE :search', { search: `%${search}%` });
      //   }),
      // );
    }

    const itemsPromise = queryBuilder.getRawMany();
    const totalPromise = queryBuilder.getCount();
    const [items, total] = await Promise.all([itemsPromise, totalPromise]);

    return { items, total };
  }

  @Get('drivers/:id')
  async getDetailDriverRequest(@Param('id') id: number) {
    const options = {
      select: {
        driver: { id: true, fullName: true, phoneNumber: true },
        files: { id: true, path: true },
        processedBy: { id: true, name: true },
      },
      where: { id },
      relations: ['files', 'driver', 'processedBy'],
    };
    const request = await this.requestsService.findOneDriverRequest(options);
    if (!request) throw new NotFoundException();

    return request;
  }

  @Patch('drivers/approval')
  @ApiOperation({ summary: 'Duyệt yêu cầu tài xế' })
  async driverApproval(@Body() { ids }: IdentityQuery, @CurrentUser() user: JwtPayload) {
    const requests = await this.requestsService.findDriverRequests({
      where: { id: In(ids), status: ERequestStatus.Pending },
    });
    if (requests.length !== ids.length) throw new NotFoundException();

    const data = { processedById: user.id, status: ERequestStatus.Approved, processedAt: new Date() };
    await this.requestsService.updateDriverRequest({ id: In(ids) }, data);
  }

  @Patch('drivers/reject')
  @ApiOperation({ summary: 'Từ chối yêu cầu tài xế' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { ids: { type: 'array', items: { type: 'number' } }, rejectReason: { type: 'string' } },
    },
  })
  async driverReject(@Body() { ids }: IdentityQuery & { rejectReason: string }, @CurrentUser() user: JwtPayload) {
    const requests = await this.requestsService.findDriverRequests({
      where: { id: In(ids), status: ERequestStatus.Pending },
    });
    if (requests.length !== ids.length) throw new NotFoundException();

    const data = { processedById: user.id, status: ERequestStatus.Rejected, processedAt: new Date() };
    await this.requestsService.updateDriverRequest({ id: In(ids) }, data);
  }

  @Get('merchants')
  @ApiOperation({ summary: 'Danh sách yêu cầu cửa hàng' })
  async getStores(@Query() query: QueryRequestMerchantDto) {
    const { page, limit, status, typeId, search } = query;
    const { createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo } = query;

    const queryBuilder = this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['merchant.id', 'merchant.name'])
      .addSelect(['store.storeCode', 'store.name'])
      .addSelect(['approvedBy.id', 'approvedBy.name'])
      .innerJoin('request.type', 'type')
      .innerJoin('request.merchant', 'merchant')
      .innerJoin('request.store', 'store')
      .leftJoin('request.approvedBy', 'approvedBy')
      .orderBy('request.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    status && queryBuilder.andWhere('request.status = :status', { status });
    typeId && queryBuilder.andWhere('request.typeId = :typeId', { typeId });
    createdAtFrom && queryBuilder.andWhere('request.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('request.createdAt <= :createdAtTo', { createdAtTo });
    approvedAtFrom && queryBuilder.andWhere('request.approvedAt >= :approvedAtFrom', { approvedAtFrom });
    approvedAtTo && queryBuilder.andWhere('request.approvedAt <= :approvedAtTo', { approvedAtTo });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('request.code ILIKE :search', { search: `%${search}%` })
            .orWhere('store.storeCode ILIKE :search', { search: `%${search}%` })
            .orWhere('store.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get('merchants/:id')
  @ApiOperation({ summary: 'Chi tiết yêu cầu cửa hàng' })
  async getDetailStoreRequest(@Param('id') id: number) {
    const request = await this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .addSelect(['merchant.id', 'merchant.name'])
      .addSelect(['store.storeCode', 'store.name'])
      .addSelect(['approvedBy.id', 'approvedBy.name'])
      .innerJoinAndSelect('request.type', 'type')
      .innerJoin('request.merchant', 'merchant')
      .innerJoin('request.store', 'store')
      .leftJoin('request.approvedBy', 'approvedBy')
      .where('request.id = :id', { id })
      .getOne();
    if (!request) throw new NotFoundException();

    return request;
  }

  @Patch('merchants/approval')
  @ApiOperation({ summary: 'Duyệt yêu cầu cửa hàng' })
  async storeApproval(@Body() { ids }: IdentityQuery, @CurrentUser() user: JwtPayload) {
    const requests = await this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .select(['request.id'])
      .where('request.id IN (:...ids)', { ids })
      .andWhere('request.status = :status', { status: ERequestStatus.Pending })
      .getMany();
    if (requests.length !== ids.length) throw new NotFoundException();

    await this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .update()
      .set({ approvedById: user.id, status: ERequestStatus.Approved, approvedAt: new Date() })
      .where('request.id IN (:...ids)', { ids })
      .execute();
  }

  @Patch('merchants/:id/reject')
  @ApiOperation({ summary: 'Từ chối yêu cầu cửa hàng' })
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string' } } } })
  async storeReject(@Body() { reason }: { reason: string }, @CurrentUser() user: JwtPayload, @Param('id') id: number) {
    const request = await this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .where('request.id = :id', { id })
      .getOne();
    if (!request) throw new NotFoundException();

    await this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .update()
      .set({ approvedById: user.id, status: ERequestStatus.Rejected, approvedAt: new Date(), reason })
      .where('request.id = :id', { id })
      .execute();
  }
}
