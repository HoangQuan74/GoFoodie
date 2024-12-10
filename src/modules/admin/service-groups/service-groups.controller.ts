import { Controller, Get, Post, Body, Patch, Param, NotFoundException, Query, ConflictException, UseGuards } from '@nestjs/common';
import { ServiceGroupsService } from './service-groups.service';
import { CreateServiceGroupDto } from './dto/create-service-group.dto';
import { UpdateServiceGroupDto } from './dto/update-service-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryServiceGroupDto } from './dto/query-service-group.dto';
import { Brackets, DataSource, Not } from 'typeorm';
import { ServiceGroupEntity } from 'src/database/entities/service-group.entity';
import { EXCEPTIONS } from 'src/common/constants';
import { AuthGuard } from '../auth/auth.guard';

@Controller('service-groups')
@ApiTags('Quản lý nhóm dịch vụ')
@UseGuards(AuthGuard)
export class ServiceGroupsController {
  constructor(
    private readonly serviceGroupsService: ServiceGroupsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() createServiceGroupDto: CreateServiceGroupDto) {
    return this.dataSource.transaction(async (manager) => {
      const { name } = createServiceGroupDto;
      const serviceGroupExist = await manager.count(ServiceGroupEntity, { where: { name: name } });
      if (serviceGroupExist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);

      const lastServiceGroup = await manager.findOne(ServiceGroupEntity, { order: { id: 'DESC' }, where: {} });

      const code = lastServiceGroup ? `${(lastServiceGroup.id + 1).toString().padStart(4, '0')}` : '0001';
      return manager.save(ServiceGroupEntity, { ...createServiceGroupDto, code });
    });
  }

  @Get()
  async find(@Query() query: QueryServiceGroupDto) {
    const { page, limit, search, status } = query;

    const queryBuilder = this.serviceGroupsService
      .createQueryBuilder('serviceGroup')
      .skip((page - 1) * limit)
      .take(limit);

    status && queryBuilder.andWhere('serviceGroup.status = :status', { status });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('serviceGroup.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('serviceGroup.code ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const serviceGroup = await this.serviceGroupsService.findOne({ where: { id: +id } });
    if (!serviceGroup) throw new NotFoundException();

    return serviceGroup;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceGroupDto: UpdateServiceGroupDto) {
    const { name } = updateServiceGroupDto;
    const serviceGroupExist = await this.serviceGroupsService.count({ where: { name, id: Not(+id) } });
    if (serviceGroupExist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);

    const serviceGroup = await this.serviceGroupsService.findOne({ where: { id: +id } });
    if (!serviceGroup) throw new NotFoundException();

    return this.serviceGroupsService.save({ ...serviceGroup, ...updateServiceGroupDto });
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const serviceGroup = await this.serviceGroupsService.findOne({ where: { id: +id } });
  //   if (!serviceGroup) throw new NotFoundException();

  //   return this.serviceGroupsService.remove(serviceGroup);
  // }
}
