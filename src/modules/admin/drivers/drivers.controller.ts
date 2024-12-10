import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { EDriverApprovalStatus } from 'src/common/enums/driver.enum';
import { QueryDriverDto } from './dto/query-driver.dto';
import { Brackets } from 'typeorm';
import { ApiBody } from '@nestjs/swagger';
import { EXCEPTIONS } from 'src/common/constants';
import { AuthGuard } from '../auth/auth.guard';

@Controller('drivers')
@UseGuards(AuthGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() createDriverDto: CreateDriverDto, @CurrentUser() user: JwtPayload) {
    const { isDraft, phoneNumber, email } = createDriverDto;

    if (phoneNumber) {
      const existingDriver = await this.driversService.findOne({ where: { phoneNumber } });
      if (existingDriver) throw new BadRequestException(EXCEPTIONS.PHONE_CONFLICT);
    }

    if (email) {
      const existingDriver = await this.driversService.findOne({ where: { email } });
      if (existingDriver) throw new BadRequestException(EXCEPTIONS.EMAIL_CONFLICT);
    }

    const newDriver = new DriverEntity();
    newDriver.createdById = user.id;
    newDriver.approvalStatus = isDraft ? EDriverApprovalStatus.Draft : EDriverApprovalStatus.Pending;
    Object.assign(newDriver, createDriverDto);

    return this.driversService.save(newDriver);
  }

  @Get()
  async find(@Query() query: QueryDriverDto) {
    const { page, limit, search, status, approvalStatus } = query;

    const queryBuilder = this.driversService
      .createQueryBuilder('driver')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .addSelect(['approvedBy.id', 'approvedBy.name'])
      .addSelect(['activeArea.id', 'activeArea.name'])
      .leftJoinAndSelect('driver.serviceTypes', 'serviceTypes')
      .leftJoin('driver.createdBy', 'createdBy')
      .leftJoin('driver.approvedBy', 'approvedBy')
      .leftJoin('driver.activeArea', 'activeArea');

    if (search) {
      queryBuilder
        .where(
          new Brackets((qb) => {
            qb.where('driver.fullName ILIKE :search');
            qb.orWhere('driver.phoneNumber ILIKE :search');
            qb.orWhere('driver.email ILIKE :search');
          }),
        )
        .setParameters({ search: `%${search}%` });
    }

    status && queryBuilder.andWhere('driver.status = :status', { status });
    approvalStatus && queryBuilder.andWhere('driver.approvalStatus = :approvalStatus', { approvalStatus });

    queryBuilder.orderBy('driver.id', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const driver = await this.driversService.findOne({
      where: { id },
      relations: ['banks', 'serviceTypes', 'emergencyContacts', 'vehicle'],
    });
    if (!driver) throw new NotFoundException();

    return driver;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
  //   return this.driversService.update(+id, updateDriverDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const driver = await this.driversService.findOne({ where: { id } });
    if (!driver) throw new NotFoundException();

    return this.driversService.remove(driver);
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const store = await this.driversService.findOne({ where: { id, approvalStatus: EDriverApprovalStatus.Pending } });
    if (!store) throw new NotFoundException();

    store.approvedById = user.id;
    store.approvedAt = new Date();
    store.approvalStatus = EDriverApprovalStatus.Approved;

    return this.driversService.save(store);
  }

  @Patch(':id/reject')
  @ApiBody({ schema: { type: 'object', properties: { approvedNote: { type: 'string' } } } })
  async reject(@Param('id') id: number, @CurrentUser() user: JwtPayload, @Body('reason') approvedNote: string) {
    const store = await this.driversService.findOne({ where: { id, approvalStatus: EDriverApprovalStatus.Pending } });
    if (!store) throw new NotFoundException();

    store.approvedById = user.id;
    store.approvedAt = new Date();
    store.approvalStatus = EDriverApprovalStatus.Rejected;
    store.approvedNote = approvedNote;

    return this.driversService.save(store);
  }
}
