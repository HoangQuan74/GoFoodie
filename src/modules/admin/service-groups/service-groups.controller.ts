import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ServiceGroupsService } from './service-groups.service';
import { CreateServiceGroupDto } from './dto/create-service-group.dto';
import { UpdateServiceGroupDto } from './dto/update-service-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryServiceGroupDto } from './dto/query-service-group.dto';
import { DataSource, ILike } from 'typeorm';
import { ServiceGroupEntity } from 'src/database/entities/service-group.entity';

@Controller('service-groups')
@ApiTags('Quản lý nhóm dịch vụ')
export class ServiceGroupsController {
  constructor(
    private readonly serviceGroupsService: ServiceGroupsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() createServiceGroupDto: CreateServiceGroupDto) {
    return this.dataSource.transaction(async (manager) => {
      const lastServiceGroup = await manager.findOne(ServiceGroupEntity, { order: { id: 'DESC' } });

      const code = lastServiceGroup ? `${(lastServiceGroup.id + 1).toString().padStart(4, '0')}` : '0001';
      return manager.save(ServiceGroupEntity, { ...createServiceGroupDto, code });
    });
  }

  @Get()
  async find(@Query() query: QueryServiceGroupDto) {
    const { page, limit, search, status } = query;
    const where = search ? { name: ILike(`%${search}%`) } : {};
    status && (where['status'] = status);
    const options = { skip: (page - 1) * limit, take: limit, where };

    const [items, total] = await this.serviceGroupsService.findAndCount(options);
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
