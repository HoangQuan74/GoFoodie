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

@Controller('admins')
@ApiTags('Admins')
@UseGuards(AuthGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async find(@Query() query: FindAdminsDto) {
    const { page, limit, search, status } = query;

    const queryBuilder = this.adminsService
      .createQueryBuilder('admin')
      .orderBy('admin.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('admin.email ILIKE :search', { search: `%${search}%` });
          qb.orWhere('admin.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }
    status && queryBuilder.andWhere('admin.status = :status', { status });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Post()
  async save(@Body() body: CreateAdminDto) {
    const { email, password } = body;

    const admin = await this.adminsService.findOne({ where: { email } });
    if (admin) throw new BadRequestException(EXCEPTIONS.EMAIL_CONFLICT);

    const hashedPassword = hashPassword(password);
    body.password = hashedPassword;

    return this.adminsService.save({ ...body, emailVerifiedAt: new Date() });
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateAdminDto) {
    const admin = await this.adminsService.findOne({ where: { id } });
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

    return this.adminsService.save({ id, ...body });
  }
}
