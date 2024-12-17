import { Controller, Get, Body, Patch, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { IdentityQuery, PaginationQuery } from 'src/common/query';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ERequestStatus } from 'src/common/enums';
import { QueryRequestDto } from './dto/query-request.dto';
import { In } from 'typeorm';

@Controller('requests')
@ApiTags('Quản lý yêu cầu')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Danh sách yêu cầu duyệt sản phẩm' })
  async getProducts(@Query() query: QueryRequestDto) {
    const { page, limit, status, type, productCategoryId, createdAtFrom, createdAtTo } = query;

    const queryBuilder = this.requestsService
      .createProductApprovalQueryBuilder('approval')
      .select([
        'approval.id as id',
        'approval.status as status',
        'approval.createdAt as "createdAt"',
        'approval.type as type',
      ])
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.requestsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
  //   return this.requestsService.update(+id, updateRequestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.requestsService.remove(+id);
  // }
}
