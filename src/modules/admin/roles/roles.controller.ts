import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { PaginationQuery } from 'src/common/query';
import { ILike } from 'typeorm';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const role = this.rolesService.findOne({ where: { name } });
    if (role) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    return this.rolesService.save(createRoleDto);
  }

  @Get()
  async find(@Query() query: PaginationQuery) {
    const { page, limit, search } = query;

    const where = search ? { name: ILike(`%${search}%`) } : {};
    const options = { skip: (page - 1) * limit, take: limit, where };
    const [items, total] = await this.rolesService.findAndCount(options);

    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const role = await this.rolesService.findOne({ where: { id }, relations: ['operations'] });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return role;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.findOne({ where: { id } });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return this.rolesService.save({ ...role, ...updateRoleDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const role = await this.rolesService.findOne({ where: { id } });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return this.rolesService.remove(role);
  }
}
