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
import { Not } from 'typeorm';
import { Roles } from 'src/common/decorators';
import { AuthGuard } from '../auth/auth.guard';
import { AdminRolesGuard } from 'src/common/guards';
import { OPERATIONS } from 'src/common/constants/operation.constant';
import { ApiTags } from '@nestjs/swagger';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { ERoleType } from 'src/common/enums';

@Controller('roles')
@ApiTags('Roles')
@UseGuards(AuthGuard, AdminRolesGuard)
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly eventGatewayService: EventGatewayService,
  ) {}

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
    const { page, limit, search, status, createdAtFrom, createdAtTo, provinceId, serviceTypeId } = query;

    const queryBuilder = this.rolesService
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.provinces', 'province')
      .leftJoinAndSelect('role.serviceTypes', 'serviceType')
      .orderBy('role.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    search && queryBuilder.andWhere('role.name ILIKE :search', { search: `%${search}%` });
    status && queryBuilder.andWhere('role.status = :status', { status });
    createdAtFrom && queryBuilder.andWhere('role.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('role.createdAt <= :createdAtTo', { createdAtTo });
    provinceId && queryBuilder.andWhere('province.id = :provinceId', { provinceId });
    serviceTypeId && queryBuilder.andWhere('serviceType.id = :serviceTypeId', { serviceTypeId });

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const role = await this.rolesService.findOne({
      where: { id },
      relations: ['operations', 'provinces', 'serviceTypes'],
    });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return role;
  }

  @Patch(':id')
  @Roles(OPERATIONS.ROLE.UPDATE)
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.findOne({
      select: { admins: { id: true } },
      where: { id },
      relations: ['admins'],
    });
    if (!role) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    const { name } = updateRoleDto;
    if (name) {
      const existedRole = await this.rolesService.findOne({ where: { name, id: Not(id) } });
      if (existedRole) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);
    }

    const adminIds = role.admins.map((admin) => admin.id);
    this.eventGatewayService.handleUpdateRole(ERoleType.Admin, adminIds);
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
