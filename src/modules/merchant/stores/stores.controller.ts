import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Query, Patch } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { Brackets, DataSource, FindOptionsWhere, Not } from 'typeorm';
import { WardsService } from 'src/modules/wards/wards.service';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EStoreApprovalStatus } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { QueryStoreDto } from './dto/query-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
@ApiTags('Merchant Stores')
@UseGuards(AuthGuard)
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
    private readonly wardsService: WardsService,
  ) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto, @CurrentUser() user: JwtPayload) {
    const { wardId, isDraft } = createStoreDto;

    return this.dataSource.transaction(async (manager) => {
      const newStore = new StoreEntity();
      newStore.merchantId = user.id;
      Object.assign(newStore, createStoreDto);
      newStore.approvalStatus = isDraft ? EStoreApprovalStatus.Draft : EStoreApprovalStatus.Pending;

      if (wardId) {
        const { districtId, provinceId } = await this.wardsService.getProvinceIdAndDistrictId(wardId);
        if (!districtId || !provinceId) throw new NotFoundException();
        newStore.districtId = districtId;
        newStore.provinceId = provinceId;
      }

      return manager.save(newStore);
    });
  }

  @Get()
  async find(@Query() query: QueryStoreDto, @CurrentUser() user: JwtPayload) {
    const { page, limit, status, approvalStatus } = query;

    const where: FindOptionsWhere<StoreEntity>[] = [{ merchantId: user.id }];
    user.storeId && where.push({ id: user.storeId });
    status && where.push({ status });

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.name',
        'store.address',
        'store.status',
        'store.approvalStatus',
        'store.createdAt',
        'store.storeAvatarId',
        'store.rejectReason',
      ])
      .leftJoinAndSelect('store.province', 'province')
      .leftJoinAndSelect('store.district', 'district')
      .leftJoinAndSelect('store.ward', 'ward')
      .where(
        new Brackets((qb) => {
          qb.where('store.merchantId = :merchantId', { merchantId: user.id });
          user.storeId && qb.orWhere('store.id = :storeId', { storeId: user.storeId });
        }),
      )
      .orderBy('store.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    status && queryBuilder.andWhere('store.status = :status', { status });
    approvalStatus && queryBuilder.andWhere('store.approvalStatus = :approvalStatus', { approvalStatus });

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .where('store.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('store.merchantId = :merchantId', { merchantId: user.id });
          user.storeId && qb.orWhere('store.id = :storeId', { storeId: user.storeId });
        }),
      )
      .leftJoinAndSelect('store.representative', 'representative')
      .leftJoinAndSelect('store.banks', 'banks')
      .leftJoinAndSelect('banks.bank', 'bank')
      .leftJoinAndSelect('banks.bankBranch', 'bankBranch')
      .leftJoinAndSelect('store.serviceType', 'serviceType')
      .leftJoinAndSelect('store.serviceGroup', 'serviceGroup')
      .leftJoinAndSelect('store.businessArea', 'businessArea')
      .leftJoinAndSelect('store.province', 'province')
      .leftJoinAndSelect('store.district', 'district')
      .leftJoinAndSelect('store.workingTimes', 'workingTimes')
      .leftJoinAndSelect('store.specialWorkingTimes', 'specialWorkingTimes')
      .leftJoinAndSelect('store.ward', 'ward');

    const store = await queryBuilder.getOne();
    if (!store) throw new NotFoundException();

    return store;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateStoreDto: UpdateStoreDto, @CurrentUser() user: JwtPayload) {
    const { wardId, isDraft } = updateStoreDto;

    const store = await this.storesService
      .createQueryBuilder('store')
      .where('store.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('store.merchantId = :merchantId', { merchantId: user.id });
          user.storeId && qb.orWhere('store.id = :storeId', { storeId: user.storeId });
        }),
      )
      .leftJoinAndSelect('store.representative', 'representative')
      .getOne();
    if (!store) throw new NotFoundException();

    if (wardId) {
      const { districtId, provinceId } = await this.wardsService.getProvinceIdAndDistrictId(wardId);
      if (!districtId || !provinceId) throw new NotFoundException();
      store.districtId = districtId;
      store.provinceId = provinceId;
      store.wardId = wardId;
    }

    this.storesService.merge(store, updateStoreDto);

    if (typeof isDraft === 'boolean' && store.approvalStatus !== EStoreApprovalStatus.Approved) {
      store.approvalStatus = isDraft ? EStoreApprovalStatus.Draft : EStoreApprovalStatus.Pending;
    }

    return this.storesService.save(store);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const options = {
      where: { id, merchantId: user.id, approvalStatus: Not(EStoreApprovalStatus.Approved) },
      relations: { workingTimes: true, banks: true, representative: true },
    };
    const store = await this.storesService.findOne(options);
    if (!store) throw new NotFoundException();

    return this.storesService.remove(store);
  }

  @Get(':id/working-times')
  async getWorkingTimes(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const store = await this.storesService
      .createQueryBuilder('store')
      .select(['store.id'])
      .where('store.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('store.merchantId = :merchantId', { merchantId: user.id });
          user.storeId && qb.orWhere('store.id = :storeId', { storeId: user.storeId });
        }),
      )
      .leftJoinAndSelect('store.workingTimes', 'workingTimes')
      .getOne();
    if (!store) throw new NotFoundException();

    return store.workingTimes;
  }

  @Get(':id/special-working-times')
  async getSpecialWorkingTimes(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const store = await this.storesService
      .createQueryBuilder('store')
      .select(['store.id', 'store.isSpecialWorkingTime'])
      .where('store.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('store.merchantId = :merchantId', { merchantId: user.id });
          user.storeId && qb.orWhere('store.id = :storeId', { storeId: user.storeId });
        }),
      )
      .leftJoinAndSelect('store.specialWorkingTimes', 'specialWorkingTimes')
      .getOne();
    if (!store) throw new NotFoundException();

    return store;
  }
}
