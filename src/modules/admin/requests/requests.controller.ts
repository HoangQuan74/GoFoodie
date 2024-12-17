import { Controller, Get, Body, Patch, Query, NotFoundException, UseGuards, Param } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { IdentityQuery } from 'src/common/query';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ERequestStatus } from 'src/common/enums';
import { QueryRequestDto } from './dto/query-request.dto';
import { Brackets, In } from 'typeorm';

@Controller('requests')
@ApiTags('Quản lý yêu cầu')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Danh sách yêu cầu duyệt sản phẩm' })
  async getProducts(@Query() query: QueryRequestDto) {
    const { page, limit, status, type, productCategoryId, createdAtFrom, createdAtTo, search } = query;

    const queryBuilder = this.requestsService
      .createProductApprovalQueryBuilder('approval')
      .select(['approval.id as id', 'approval.code as code', 'approval.status as status', 'approval.type as type'])
      .addSelect(['approval.createdAt as "createdAt"'])
      .addSelect(['product.code as "productCode"', 'product.name as "productName"', 'product.price as "productPrice"'])
      .addSelect(['product.description as "productDescription"', 'product.imageId as "productImageId"'])
      .addSelect(['store.storeCode as "storeCode"', 'store.name as "storeName"'])
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
    const [items, total] = await Promise.all([itemsPromise, totalPromise]);

    return { items, total };
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

  @Patch('products/reject')
  @ApiOperation({ summary: 'Từ chối yêu cầu duyệt sản phẩm' })
  async productReject(@Body() { ids }: IdentityQuery, @CurrentUser() user: JwtPayload) {
    const requests = await this.requestsService.findProductApprovals({
      where: { id: In(ids), status: ERequestStatus.Pending },
    });
    if (requests.length !== ids.length) throw new NotFoundException();

    const data = { processedById: user.id, status: ERequestStatus.Rejected, processedAt: new Date() };
    await this.requestsService.updateProductApproval({ id: In(ids) }, data);
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
  async driverReject(@Body() { ids }: IdentityQuery, @CurrentUser() user: JwtPayload) {
    const requests = await this.requestsService.findDriverRequests({
      where: { id: In(ids), status: ERequestStatus.Pending },
    });
    if (requests.length !== ids.length) throw new NotFoundException();

    const data = { processedById: user.id, status: ERequestStatus.Rejected, processedAt: new Date() };
    await this.requestsService.updateDriverRequest({ id: In(ids) }, data);
  }
}
