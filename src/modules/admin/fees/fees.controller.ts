import { Controller, Get, Post, Body, Param, Query, UseGuards, NotFoundException, Delete, Patch } from '@nestjs/common';
import { FeesService } from './fees.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { QueryFeeDto } from './dto/query-fee.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { Brackets } from 'typeorm';

@Controller('fees')
@ApiTags('Cấu hình phí')
@UseGuards(AuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post()
  create(@Body() createFeeDto: CreateFeeDto, @CurrentUser() user: JwtPayload) {
    const newFee = new FeeEntity();
    Object.assign(newFee, createFeeDto);
    newFee.createdById = user.id;

    return this.feesService.save(newFee);
  }

  @Get('types')
  async getTypes() {
    return this.feesService.getTypes();
  }

  @Get()
  async find(@Query() query: QueryFeeDto) {
    const { page, limit, search, isActive, feeTypeId } = query;
    const queryBuilder = this.feesService
      .createQueryBuilder('fee')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoin('fee.createdBy', 'createdBy')
      .innerJoinAndSelect('fee.feeType', 'feeType')
      .innerJoinAndSelect('fee.serviceType', 'serviceType')
      .innerJoinAndSelect('fee.appFees', 'appFees')
      .innerJoinAndSelect('appFees.appType', 'appType')
      .orderBy('fee.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('feeType.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('serviceType.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('fee.isActive = :isActive', { isActive });
    }

    feeTypeId && queryBuilder.andWhere('fee.feeTypeId = :feeTypeId', { feeTypeId });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fee = await this.feesService.findOne({ where: { id: +id } });
    if (!fee) throw new NotFoundException();

    return fee;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFeeDto: UpdateFeeDto) {
    const fee = await this.feesService.findOne({ where: { id: +id } });
    if (!fee) throw new NotFoundException();

    Object.assign(fee, updateFeeDto);
    return this.feesService.save(fee);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const fee = await this.feesService.findOne({ where: { id: +id } });
    if (!fee) throw new NotFoundException();

    return this.feesService.remove(fee);
  }
}
