import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';
import { PaginationQuery } from 'src/common/query';

@Controller('option-groups')
export class OptionGroupsController {
  constructor(private readonly optionGroupsService: OptionGroupsService) {}

  @Post()
  create(@Body() createOptionGroupDto: CreateOptionGroupDto) {
    return this.optionGroupsService.save(createOptionGroupDto);
  }

  @Get()
  find(@Query() query: PaginationQuery) {
    return this.optionGroupsService.findAndCount();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const optionGroup = await this.optionGroupsService.findOne({ where: { id }, relations: ['options'] });
    if (!optionGroup) throw new NotFoundException();

    return optionGroup;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionGroupDto: UpdateOptionGroupDto) {
    // return this.optionGroupsService.update(+id, updateOptionGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const optionGroup = await this.optionGroupsService.findOne({ where: { id } });
    if (!optionGroup) throw new NotFoundException();

    return this.optionGroupsService.remove(optionGroup);
  }
}
