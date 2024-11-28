import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateStaffDto } from './dto/create-staff.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { Not } from 'typeorm';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staffs')
@ApiTags('Admin Staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Get()
  async find(@Param('storeId') storeId: number) {
    const options = { where: { storeId } };
    return this.staffsService.find(options);
  }

  @Post()
  async create(@Body() createStaffDto: CreateStaffDto, @Param('storeId') storeId: number) {
    const { password, email, phone } = createStaffDto;
    console.log('createStaffDto', storeId);
    const options = { where: [{ email }, { phone: phone }] };
    const merchant = await this.staffsService.findOne(options);

    if (email && merchant?.email === email) throw new ConflictException(EXCEPTIONS.EMAIL_CONFLICT);
    if (phone && merchant?.phone === phone) throw new ConflictException(EXCEPTIONS.PHONE_CONFLICT);

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
