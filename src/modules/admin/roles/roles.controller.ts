import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindRolesDto } from './dto/find-roles.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { ILike } from 'typeorm';
import { Roles } from 'src/common/decorators';
import { AuthGuard } from '../auth/auth.guard';
import { AdminRolesGuard } from 'src/common/guards';
import { OPERATIONS } from 'src/common/constants/operation.constant';

@Controller('roles')
@UseGuards(AuthGuard, AdminRolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(OPERATIONS.ROLE.CREATE)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const role = await this.rolesService.findOne({ where: { name } });
    if (role) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    return this.rolesService.save(createRoleDto);
  }

  @Get()
  // @Roles(OPERATIONS.ROLE.READ)
  async find(@Query() query: FindRolesDto) {
    const { page, limit, search, status } = query;

    const where = search ? { name: ILike(`%${search}%`) } : {};
    status && (where['status'] = status);

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
  @Roles(OPERATIONS.ROLE.UPDATE)
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.findOne({ where: { id } });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return this.rolesService.save({ ...role, ...updateRoleDto });
  }

  @Delete(':id')
  @Roles(OPERATIONS.ROLE.DELETE)
  async remove(@Param('id') id: number) {
    const role = await this.rolesService.findOne({ where: { id } });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return this.rolesService.remove(role);
  }
}
