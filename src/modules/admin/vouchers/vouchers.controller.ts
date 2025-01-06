import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryVoucherDto } from './dto/query-voucher.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { EXCEPTIONS } from 'src/common/constants';
import { DataSource, EntityManager } from 'typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';

@Controller('vouchers')
@ApiTags('Quản lý voucher')
@UseGuards(AuthGuard)
export class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách voucher' })
  async find(@Query() query: QueryVoucherDto) {
    const { page, limit, search } = query;
    const queryBuilder = this.vouchersService
      .createQueryBuilder('voucher')
      .select(['voucher.id as id', 'voucher.code as code', 'voucher.name as name', 'voucher.isActive as "isActive"'])
      .addSelect(['voucher.startTime as "startTime"', 'voucher.endTime as "endTime"'])
      .addSelect(['voucher.discountType as "discountType"', 'voucher.discountValue as "discountValue"'])
      .addSelect(['createdBy.name as "createdByName"'])
      .addSelect(['serviceType.name as "serviceTypeName"'])
      .addSelect(['type.name as "typeName"'])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(1)', 'count')
          .from('voucher_products', 'vp')
          .where('vp.voucher_id = voucher.id')
          .innerJoin(ProductEntity, 'product', 'product.id = vp.product_id')
      }, 'productsCount')
      .leftJoin('voucher.createdBy', 'createdBy')
      .leftJoin('voucher.serviceType', 'serviceType')
      .leftJoin('voucher.type', 'type')
      .leftJoin('voucher.products', 'products')
      .orderBy('voucher.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    const items = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return { items, total };
  }

  @Post()
  @ApiOperation({ summary: 'Tạo voucher' })
  async create(@Body() body: CreateVoucherDto, @CurrentUser() user: JwtPayload) {
    const { code } = body;

    return this.dataSource.transaction(async (manager: EntityManager) => {
      const isExist = await manager.findOne(VoucherEntity, { where: { code } });
      if (isExist) throw new ConflictException(EXCEPTIONS.CODE_EXISTED);

      const voucher = new VoucherEntity();
      Object.assign(voucher, body);
      voucher.createdById = user.id;
      return manager.save(voucher);
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật voucher' })
  async update(@Body() body: UpdateVoucherDto, @Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    return this.vouchersService.save(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa voucher' })
  async remove(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    return this.vouchersService.remove(voucher);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết voucher' })
  async findOne(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({
      select: { products: { id: true, name: true } },
      where: { id: id },
      relations: ['products'],
    });
    if (!voucher) throw new NotFoundException();

    return voucher;
  }
}
