import { WardsService } from './../../wards/wards.service';
import { Body, Controller, Delete, Get, NotFoundException, Patch, Post, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { QueryStoreDto } from './dto/query-store.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { StoreEntity } from 'src/database/entities/store.entity';
import { Brackets, DataSource, In, Like } from 'typeorm';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { IdentityQuery } from 'src/common/query';
import { EStoreApprovalStatus } from 'src/common/enums';
import * as moment from 'moment-timezone';
import { TIMEZONE } from 'src/common/constants';

@Controller('stores')
@ApiTags('Stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
    private readonly wardsService: WardsService,
  ) {}

  @Post()
  async create(@Body() body: CreateStoreDto, @CurrentUser() user: JwtPayload) {
    const { wardId, isDraft } = body;
    const { districtId, provinceId } = await this.wardsService.getProvinceIdAndDistrictId(wardId);

    if (!districtId || !provinceId) throw new NotFoundException();

    return this.dataSource.transaction(async (manager) => {
      const newStore = new StoreEntity();
      Object.assign(newStore, body);
      newStore.createdById = user.id;
      newStore.districtId = districtId;
      newStore.provinceId = provinceId;
      newStore.status = isDraft ? EStoreApprovalStatus.Draft : EStoreApprovalStatus.Pending;

      const today = moment().tz(TIMEZONE).format('YYMMDD');
      const latestStore = await manager.findOne(StoreEntity, {
        where: { storeCode: Like(`${today}%`) },
        order: { storeCode: 'DESC' },
        withDeleted: true,
      });

      const numberStore = latestStore ? +latestStore.storeCode.slice(-2) + 1 : 1;
      newStore.storeCode = `${today}${numberStore.toString().padStart(2, '0')}`;

      return manager.save(newStore);
    });
  }

  @Get()
  async find(@Query() query: QueryStoreDto) {
    const { search, page, limit, sort, serviceTypeId, businessAreaId, approvalStatus, status, merchantId } = query;
    const { createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo } = query;

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
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

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Query('id') id: number) {
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
      },
    });
    if (!store) throw new NotFoundException();

    return store;
  }

  @Patch(':id')
  async update(@Query('id') id: number, @Body() body: UpdateStoreDto) {
    const store = await this.storesService.findOne({ where: { id } });
    if (!store) throw new NotFoundException();

    Object.assign(store, body);
    return this.storesService.save(store);
  }

  @Delete()
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
  async approve(@Query('id') id: number, @CurrentUser() user: JwtPayload) {
    const store = await this.storesService.findOne({ where: { id, approvalStatus: EStoreApprovalStatus.Pending } });
    if (!store) throw new NotFoundException();

    store.approvedById = user.id;
    store.approvedAt = new Date();
    store.approvalStatus = EStoreApprovalStatus.Approved;

    return this.storesService.save(store);
  }

  @Patch(':id/reject')
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string' } } } })
  async reject(@Query('id') id: number, @CurrentUser() user: JwtPayload, @Body('reason') reason: string) {
    const store = await this.storesService.findOne({ where: { id, approvalStatus: EStoreApprovalStatus.Pending } });
    if (!store) throw new NotFoundException();

    store.approvedById = user.id;
    store.approvedAt = new Date();
    store.approvalStatus = EStoreApprovalStatus.Rejected;
    store.rejectReason = reason;

    return this.storesService.save(store);
  }

  @Patch(':id/send-approve')
  async sendApprove(@Query('id') id: number) {
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
