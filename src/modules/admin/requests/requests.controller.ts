import {
  Controller,
  Get,
  Body,
  Patch,
  Query,
  NotFoundException,
  UseGuards,
  Param,
  Post,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { IdentityQuery } from 'src/common/query';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ERequestStatus } from 'src/common/enums';
import { QueryRequestProductDto, QueryRequestMerchantDto, QueryRequestDriverDto } from './dto/query-request.dto';
import { Brackets, In } from 'typeorm';
import { QueryRequestTypeDto } from './dto/query-request-type.dto';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { EXCEPTIONS } from 'src/common/constants';

@Controller('requests')
@ApiTags('Quản lý yêu cầu')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('types')
  @ApiOperation({ summary: 'Danh sách loại yêu cầu' })
  async getRequestTypes(@Query() query: QueryRequestTypeDto) {
    const { page, limit, search, isActive, appTypeId, createdAtFrom, createdAtTo } = query;

    const queryBuilder = this.requestsService
      .createRequestTypeQueryBuilder('requestType')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoinAndSelect('requestType.appTypes', 'appTypes')
      .leftJoin('requestType.createdBy', 'createdBy')
      .orderBy('requestType.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    search && queryBuilder.andWhere('requestType.name ILIKE :search', { search: `%${search}%` });
    typeof isActive === 'boolean' && queryBuilder.andWhere('requestType.isActive = :isActive', { isActive });
    appTypeId && queryBuilder.andWhere('appTypes.value = :appTypeId', { appTypeId });
    createdAtFrom && queryBuilder.andWhere('requestType.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('requestType.createdAt <= :createdAtTo', { createdAtTo });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Chi tiết loại yêu cầu' })
  async getRequestType(@Param('id') id: number) {
    const requestType = await this.requestsService.findOneRequestType({ where: { id } });
    if (!requestType) throw new NotFoundException();

    return requestType;
  }

  @Post('types')
  @ApiOperation({ summary: 'Tạo loại yêu cầu' })
  async createRequestType(@Body() body: CreateRequestTypeDto, @CurrentUser() user: JwtPayload) {
    const { name } = body;
    const isExist = await this.requestsService.findOneRequestType({ where: { name } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    return this.requestsService.saveRequestType({ ...body, createdById: user.id });
  }

  @Patch('types/:id')
  @ApiOperation({ summary: 'Cập nhật loại yêu cầu' })
  async updateRequestType(@Param('id') id: number, @Body() body: CreateRequestTypeDto) {
    const requestType = await this.requestsService.findOneRequestType({ where: { id } });
    if (!requestType) throw new NotFoundException();

    Object.assign(requestType, body);
    return this.requestsService.saveRequestType(requestType);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: 'Xóa loại yêu cầu' })
  async deleteRequestType(@Param('id') id: number) {
    const requestType = await this.requestsService.findOneRequestType({ where: { id } });
    if (!requestType) throw new NotFoundException();

    return this.requestsService.removeRequestType(requestType);
  }

  @Get('products')
  @ApiOperation({ summary: 'Danh sách yêu cầu duyệt sản phẩm' })
  async getProducts(@Query() query: QueryRequestProductDto) {
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
  async getDrivers(@Query() query: QueryRequestDriverDto) {
    const { page, limit, status, typeId, search } = query;
    const { approvedAtFrom, approvedAtTo, createdAtFrom, createdAtTo } = query;

    const queryBuilder = this.requestsService
      .createDriverRequestQueryBuilder('request')
      .withDeleted()
      .select(['request.id as id', 'request.code as code', 'request.status as status', 'type.name as "typeName"'])
      .addSelect(['request.createdAt as "createdAt"', 'request.description as "description"'])
      .addSelect(['request.reason as "reason"'])
      .addSelect(['driver.fullName as "driverName"', 'driver.phoneNumber as "driverPhone"'])
      .addSelect(['approvedBy.name as "approvedByName"', 'request.approvedAt as "approvedAt"'])
      .innerJoin('request.driver', 'driver')
      .innerJoin('request.type', 'type')
      .leftJoin('request.approvedBy', 'approvedBy')
      .orderBy('request.id', 'DESC')
      .where('request.deletedAt IS NULL')
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
            .orWhere('driver.fullName ILIKE :search', { search: `%${search}%` })
            .orWhere('driver.phoneNumber ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const countQuery = this.requestsService.createDriverRequestQueryBuilder('request');

    const itemsPromise = queryBuilder.getRawMany();
    const totalPromise = queryBuilder.getCount();
    const pendingPromise = countQuery.where(`request.status = '${ERequestStatus.Pending}'`).getCount();
    const approvedPromise = countQuery.where(`request.status = '${ERequestStatus.Approved}'`).getCount();
    const rejectedPromise = countQuery.where(`request.status = '${ERequestStatus.Rejected}'`).getCount();

    const [items, total, pending, approved, rejected] = await Promise.all([
      itemsPromise,
      totalPromise,
      pendingPromise,
      approvedPromise,
      rejectedPromise,
    ]);

    return { items, total, pending, approved, rejected };
  }

  @Get('drivers/:id')
  async getDetailDriverRequest(@Param('id') id: number) {
    const options = {
      select: {
        driver: { id: true, fullName: true, phoneNumber: true },
        files: { id: true, path: true },
        approvedBy: { id: true, name: true },
      },
      where: { id },
      relations: ['files', 'driver', 'approvedBy'],
      withDeleted: true,
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

    const data = { approvedById: user.id, status: ERequestStatus.Approved, approvedAt: new Date() };
    await this.requestsService.updateDriverRequest({ id: In(ids) }, data);
  }

  @Patch('drivers/:id/reject')
  @ApiOperation({ summary: 'Từ chối yêu cầu tài xế' })
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string' } } } })
  async driverReject(@Body() { reason }: { reason: string }, @CurrentUser() user: JwtPayload, @Param('id') id: number) {
    const request = await this.requestsService.findOneDriverRequest({
      where: { id, status: ERequestStatus.Pending },
    });
    if (!request) throw new NotFoundException();

    const data = { approvedById: user.id, status: ERequestStatus.Rejected, approvedAt: new Date(), reason };
    await this.requestsService.updateDriverRequest({ id }, data);
  }

  @Get('stores')
  @ApiOperation({ summary: 'Danh sách yêu cầu cửa hàng' })
  async getStores(@Query() query: QueryRequestMerchantDto) {
    const { page, limit, status, typeId, search } = query;
    const { createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo } = query;

    const queryBuilder = this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .withDeleted()
      .addSelect(['type.id', 'type.name'])
      .addSelect(['merchant.id', 'merchant.name'])
      .addSelect(['store.storeCode', 'store.name'])
      .addSelect(['approvedBy.id', 'approvedBy.name'])
      .innerJoin('request.type', 'type')
      .innerJoin('request.merchant', 'merchant')
      .innerJoin('request.store', 'store')
      .leftJoin('request.approvedBy', 'approvedBy')
      .where('request.deletedAt IS NULL')
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

    const countQuery = this.requestsService.createMerchantRequestQueryBuilder('request');

    const pendingPromise = countQuery.where(`request.status = '${ERequestStatus.Pending}'`).getCount();
    const approvedPromise = countQuery.where(`request.status = '${ERequestStatus.Approved}'`).getCount();
    const rejectedPromise = countQuery.where(`request.status = '${ERequestStatus.Rejected}'`).getCount();

    const [[items, total], pending, approved, rejected] = await Promise.all([
      queryBuilder.getManyAndCount(),
      pendingPromise,
      approvedPromise,
      rejectedPromise,
    ]);

    return { items, total, pending, approved, rejected };
  }

  @Get('stores/types')
  @ApiOperation({ summary: 'Danh sách loại yêu cầu cửa hàng' })
  async getStoreRequestTypes() {
    return this.requestsService.findRequestTypes();
  }

  @Get('stores/:id')
  @ApiOperation({ summary: 'Chi tiết yêu cầu cửa hàng' })
  async getDetailStoreRequest(@Param('id') id: number) {
    const request = await this.requestsService
      .createMerchantRequestQueryBuilder('request')
      .withDeleted()
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

  @Patch('stores/approval')
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
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  @Patch('stores/:id/reject')
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
      .where('id = :id', { id })
      .execute();
  }
}
