import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ServiceGroupsService } from './service-groups.service';
import { CreateServiceGroupDto } from './dto/create-service-group.dto';
import { UpdateServiceGroupDto } from './dto/update-service-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/query';
import { ILike } from 'typeorm';

@Controller('service-groups')
@ApiTags('Quản lý nhóm dịch vụ')
export class ServiceGroupsController {
  constructor(private readonly serviceGroupsService: ServiceGroupsService) {}

  @Post()
  create(@Body() createServiceGroupDto: CreateServiceGroupDto) {
    return this.serviceGroupsService.save(createServiceGroupDto);
  }

  @Get()
  async find(@Query() query: PaginationQuery) {
    const { page, limit, search } = query;
    const where = search ? { name: ILike(`%${search}%`) } : {};
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const serviceGroup = await this.serviceGroupsService.findOne({ where: { id: +id } });
    if (!serviceGroup) throw new NotFoundException();

    return this.serviceGroupsService.remove(serviceGroup);
  }
}
