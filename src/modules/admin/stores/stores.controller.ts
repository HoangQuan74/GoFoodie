import { WardsService } from './../../wards/wards.service';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { QueryStoreDto } from './dto/query-store.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { StoreEntity } from 'src/database/entities/store.entity';
import { Brackets, DataSource, In, Like } from 'typeorm';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { IdentityQuery } from 'src/common/query';
import { EStoreApprovalStatus } from 'src/common/enums';
import { ProductEntity } from 'src/database/entities/product.entity';
import { AuthGuard } from '../auth/auth.guard';
import { AdminRolesGuard } from 'src/common/guards';
import { OPERATIONS } from 'src/common/constants/operation.constant';

@Controller('stores')
@ApiTags('Stores')
@UseGuards(AuthGuard, AdminRolesGuard)
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
    private readonly wardsService: WardsService,
  ) {}

  @Post()
  @Roles(OPERATIONS.STORE.CREATE)
  async create(@Body() body: CreateStoreDto, @CurrentUser() user: JwtPayload) {
    const { wardId, isDraft } = body;

    return this.dataSource.transaction(async (manager) => {
      const newStore = new StoreEntity();
      Object.assign(newStore, body);
      newStore.createdById = user.id;
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
  async find(@Query() query: QueryStoreDto) {
    const { search, page, limit, sort, serviceTypeId, businessAreaId, approvalStatus, status, merchantId } = query;
    const { createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo } = query;

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(product.id)', 'productCount')
          .from(ProductEntity, 'product')
          .where('product.storeId = store.id');
      }, 'productCount')
      .leftJoinAndSelect('store.businessArea', 'businessArea')
      .leftJoinAndSelect('store.province', 'province')
      .leftJoinAndSelect('store.district', 'district')
      .leftJoinAndSelect('store.ward', 'ward')
      .leftJoinAndSelect('store.serviceType', 'serviceType')
      .leftJoinAndSelect('store.serviceGroup', 'serviceGroup')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoin('store.createdBy', 'createdBy')
      .addSelect(['approvedBy.id', 'approvedBy.name'])
      .leftJoin('store.approvedBy', 'approvedBy')
      .addSelect(['representative.id', 'representative.name', 'representative.phone', 'representative.type'])
      .leftJoin('store.representative', 'representative');

    if (search) {
      queryBuilder
        .andWhere(
          new Brackets((qb) => {
            qb.where('store.name ILIKE :search');
            qb.orWhere('store.phoneNumber ILIKE :search');
            qb.orWhere('representative.email ILIKE :search');
            qb.orWhere('representative.name ILIKE :search');
            qb.orWhere('store.storeCode ILIKE :search');
            qb.orWhere('store.address ILIKE :search');
          }),
        )
        .setParameters({ search: `%${search}%` });
    }

    merchantId && queryBuilder.andWhere('store.merchantId = :merchantId');
    approvalStatus && queryBuilder.andWhere('store.approvalStatus = :approvalStatus');
    status && queryBuilder.andWhere('store.status = :status');
    serviceTypeId && queryBuilder.andWhere('store.serviceTypeId = :serviceTypeId');
    businessAreaId && queryBuilder.andWhere('store.businessAreaId = :businessAreaId');
    createdAtFrom && queryBuilder.andWhere('store.createdAt >= :createdAtFrom');
    createdAtTo && queryBuilder.andWhere('store.createdAt <= :createdAtTo');
    approvedAtFrom && queryBuilder.andWhere('store.approvedAt >= :approvedAtFrom');
    approvedAtTo && queryBuilder.andWhere('store.approvedAt <= :approvedAtTo');

    queryBuilder.setParameters({ serviceTypeId, businessAreaId, approvalStatus, status, merchantId });
    queryBuilder.setParameters({ createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo });

    if (sort) {
      const [column, order] = sort.split(':') as [string, 'ASC' | 'DESC'];
      queryBuilder.orderBy(`store.${column}`, order);
    }

    queryBuilder.skip((page - 1) * limit);

    const { raw, entities } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    const items = entities.map((entity) => {
      const item = entity;
      item.productCount = raw.find((r) => r.store_id === entity.id).productCount;
      return item;
    });

    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const store = await this.storesService.findOne({
      select: { createdBy: { id: true, name: true }, approvedBy: { id: true, name: true } },
      where: { id },
      relations: {
        representative: true,
        workingTimes: true,
        banks: { bank: true, bankBranch: true },
        serviceType: true,
        serviceGroup: true,
        businessArea: true,
        province: true,
        district: true,
        ward: true,
        createdBy: true,
        approvedBy: true,
        specialWorkingTimes: true,
      },
    });
    if (!store) throw new NotFoundException();

    return store;
  }

  @Patch(':id')
  @Roles(OPERATIONS.STORE.UPDATE)
  async update(@Param('id') id: number, @Body() body: UpdateStoreDto) {
    const { wardId, isDraft } = body;
    const store = await this.storesService.findOne({ where: { id }, relations: { representative: true } });
    if (!store) throw new NotFoundException();

    if (wardId) {
      const { districtId, provinceId } = await this.wardsService.getProvinceIdAndDistrictId(wardId);
      if (!districtId || !provinceId) throw new NotFoundException();
      store.districtId = districtId;
      store.provinceId = provinceId;
      store.wardId = wardId;
    }

    this.storesService.merge(store, body);

    if (typeof isDraft === 'boolean' && store.approvalStatus !== EStoreApprovalStatus.Approved) {
      store.approvalStatus = isDraft ? EStoreApprovalStatus.Draft : EStoreApprovalStatus.Pending;
    }

    return this.storesService.save(store);
  }

  @Delete()
  @Roles(OPERATIONS.STORE.DELETE)
  async delete(@Body() query: IdentityQuery) {
    const { ids } = query;
    const options = {
      where: { id: In(ids), isDraft: false },
      relations: { workingTimes: true, banks: true, representative: true },
    };
    const stores = await this.storesService.find(options);
    if (!stores.length) throw new NotFoundException();

    return this.storesService.remove(stores);
  }

  @Patch(':id/approve')
  @Roles(OPERATIONS.STORE.APPROVE)
  async approve(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.dataSource.transaction(async (manager) => {
      const store = await manager.findOne(StoreEntity, {
        where: { id, approvalStatus: EStoreApprovalStatus.Pending },
        relations: { serviceType: true, businessArea: true },
      });
      if (!store) throw new NotFoundException();

      const preCode = store.businessArea.shortName + store.serviceType.code;
      const latestStore = await manager.findOne(StoreEntity, {
        where: { storeCode: Like(`${preCode}%`) },
        order: { storeCode: 'DESC' },
        withDeleted: true,
      });

      store.approvedById = user.id;
      store.approvedAt = new Date();
      store.approvalStatus = EStoreApprovalStatus.Approved;
      const numberStore = latestStore ? +latestStore.storeCode.slice(-3) + 1 : 1;
      store.storeCode = `${preCode}${numberStore.toString().padStart(3, '0')}`;

      return manager.save(store);
    });
  }

  @Patch(':id/reject')
  @Roles(OPERATIONS.STORE.APPROVE)
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string' } } } })
  async reject(@Param('id') id: number, @CurrentUser() user: JwtPayload, @Body('reason') reason: string) {
    const store = await this.storesService.findOne({ where: { id, approvalStatus: EStoreApprovalStatus.Pending } });
    if (!store) throw new NotFoundException();

    store.approvedById = user.id;
    store.approvedAt = new Date();
    store.approvalStatus = EStoreApprovalStatus.Rejected;
    store.rejectReason = reason;

    return this.storesService.save(store);
  }

  @Patch(':id/send-approve')
  async sendApprove(@Param('id') id: number) {
    const store = await this.storesService.findOne({
      where: { id, approvalStatus: In([EStoreApprovalStatus.Rejected, EStoreApprovalStatus.Draft]) },
    });
    if (!store) throw new NotFoundException();

    store.approvedById = null;
    store.approvedAt = null;
    store.approvalStatus = EStoreApprovalStatus.Pending;
    store.rejectReason = null;

    return this.storesService.save(store);
  }
}
