import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FindAdminsDto } from './dto/find-admins.dto';
import { AdminsService } from './admins.service';
import { EXCEPTIONS } from 'src/common/constants';
import { hashPassword } from 'src/utils/bcrypt';
import { Brackets, Not } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AdminRolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { OPERATIONS } from 'src/common/constants/operation.constant';

@Controller('admins')
@ApiTags('Admins')
@UseGuards(AuthGuard, AdminRolesGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async find(@Query() query: FindAdminsDto) {
    const { page, limit, search, status, createdAtFrom, createdAtTo } = query;

    const queryBuilder = this.adminsService
      .createQueryBuilder('admin')
      .addSelect(['role.id', 'role.name'])
      .leftJoin('admin.role', 'role')
      .where('admin.isRoot = false')
      .orderBy('admin.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('admin.email ILIKE :search', { search: `%${search}%` });
          qb.orWhere('admin.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }
    status && queryBuilder.andWhere('admin.status = :status', { status });
    createdAtFrom && queryBuilder.andWhere('admin.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('admin.createdAt <= :createdAtTo', { createdAtTo });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Post()
  @Roles(OPERATIONS.ADMIN.CREATE)
  async save(@Body() body: CreateAdminDto) {
    const { email, password } = body;

    const admin = await this.adminsService.findOne({ where: { email } });
    if (admin) throw new BadRequestException(EXCEPTIONS.EMAIL_CONFLICT);

    const hashedPassword = hashPassword(password);
    body.password = hashedPassword;

    return this.adminsService.save({ ...body, emailVerifiedAt: new Date() });
  }

  @Patch(':id')
  @Roles(OPERATIONS.ADMIN.UPDATE)
  async update(@Param('id') id: number, @Body() body: UpdateAdminDto) {
    const admin = await this.adminsService.findOne({ where: { id, isRoot: false } });
    if (!admin) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    const { email, password } = body;

    if (email) {
      const admin = await this.adminsService.findOne({ where: { email, id: Not(id) } });
      if (admin) throw new BadRequestException(EXCEPTIONS.EMAIL_CONFLICT);
    }

    if (password) {
      const hashedPassword = hashPassword(password);
      body.password = hashedPassword;
    }

    return this.adminsService.save({ ...admin, ...body });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const admin = await this.adminsService.findOne({ where: { id }, relations: ['role'] });
    if (!admin) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return admin;
  }
}
