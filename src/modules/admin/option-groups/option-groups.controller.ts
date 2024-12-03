import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';
import { QueryOptionGroupDto } from './dto/query-option-group.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';

@Controller('option-groups')
@ApiTags('Quản lý nhóm tùy chọn sản phẩm')
export class OptionGroupsController {
  constructor(private readonly optionGroupsService: OptionGroupsService) {}

  @Post()
  create(@Body() createOptionGroupDto: CreateOptionGroupDto) {
    return this.optionGroupsService.save(createOptionGroupDto);
  }

  @Get()
  async find(@Query() query: QueryOptionGroupDto) {
    const { limit, page, search, status, storeId } = query;
    const where = { storeId };
    status && (where['status'] = status);
    search && (where['name'] = ILike(`%${search}%`));

    const options: FindManyOptions<OptionGroupEntity> = {
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'DESC' },
    };
    const [item, total] = await this.optionGroupsService.findAndCount(options);
    return { item, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const optionGroup = await this.optionGroupsService.findOne({ where: { id }, relations: ['options'] });
    if (!optionGroup) throw new NotFoundException();

    return optionGroup;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateOptionGroupDto: UpdateOptionGroupDto) {
    const optionGroup = await this.optionGroupsService.findOne({ where: { id } });
    if (!optionGroup) throw new NotFoundException();

    return this.optionGroupsService.save({ ...optionGroup, ...updateOptionGroupDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const optionGroup = await this.optionGroupsService.findOne({ where: { id } });
    if (!optionGroup) throw new NotFoundException();

    return this.optionGroupsService.remove(optionGroup);
  }
}
