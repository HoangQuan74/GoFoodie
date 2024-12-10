import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateStaffDto } from './dto/create-staff.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { Brackets, Not } from 'typeorm';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { QueryStaffDto } from './dto/query-staff.dto';

@Controller('staffs')
@ApiTags('Admin Staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Get()
  async find(@Param('storeId') storeId: number, @Query() query: QueryStaffDto) {
    const { page, limit, search, sort, status } = query;

    const queryBuilder = this.staffsService
      .createQueryBuilder('staff')
      .where('staff.storeId = :storeId', { storeId })
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('staff.name ILIKE :search', { search: `%${search}%` })
            .orWhere('staff.email ILIKE :search', { search: `%${search}%` })
            .orWhere('staff.phone ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    status && queryBuilder.andWhere('staff.status = :status', { status });

    const [field, order] = sort.split(':') as [keyof MerchantEntity, 'ASC' | 'DESC'];
    queryBuilder.orderBy(`staff.${field}`, order);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Post()
  async create(@Body() createStaffDto: CreateStaffDto, @Param('storeId') storeId: number) {
    const { password, email, phone } = createStaffDto;

    if (phone) {
      const phoneConflict = await this.staffsService.findOne({ where: { phone } });
      if (phoneConflict) throw new ConflictException(EXCEPTIONS.PHONE_CONFLICT);
    }

    if (email) {
      const emailConflict = await this.staffsService.findOne({ where: { email } });
      if (emailConflict) throw new ConflictException(EXCEPTIONS.EMAIL_CONFLICT);
    }

    const newStaff = new MerchantEntity();
    newStaff.storeId = +storeId;
    Object.assign(newStaff, createStaffDto);
    email && (newStaff.emailVerifiedAt = new Date());
    password && (newStaff.password = hashPassword(password));

    return this.staffsService.save(newStaff);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateStaffDto: UpdateStaffDto) {
    const { password, email, phone } = updateStaffDto;
    delete updateStaffDto.password;

    const options = { where: { id: +id } };
    const staff = await this.staffsService.findOne(options);
    if (!staff) throw new NotFoundException();

    if (email) {
      const emailConflict = await this.staffsService.findOne({ where: { email, id: Not(staff.id) } });
      if (emailConflict) throw new ConflictException(EXCEPTIONS.EMAIL_CONFLICT);
    }

    if (phone) {
      const phoneConflict = await this.staffsService.findOne({ where: { phone, id: Not(staff.id) } });
      if (phoneConflict) throw new ConflictException(EXCEPTIONS.PHONE_CONFLICT);
    }

    Object.assign(staff, updateStaffDto);
    password && (staff.password = hashPassword(password));
    email && !staff.emailVerifiedAt && (staff.emailVerifiedAt = new Date());

    return this.staffsService.save(staff);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const options = { where: { id } };
    const staff = await this.staffsService.findOne(options);
    if (!staff) throw new NotFoundException();

    return staff;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const options = { where: { id } };
    const staff = await this.staffsService.findOne(options);
    if (!staff) throw new NotFoundException();

    return this.staffsService.remove(staff);
  }
}
