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
import { DriverEntity } from 'src/database/entities/driver.entity';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { EDriverApprovalStatus } from 'src/common/enums/driver.enum';
import { QueryDriverDto } from './dto/query-driver.dto';
import { Brackets } from 'typeorm';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EXCEPTIONS } from 'src/common/constants';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AdminRolesGuard } from 'src/common/guards';
import { OPERATIONS } from 'src/common/constants/operation.constant';

@Controller('drivers')
@ApiTags('Drivers')
@UseGuards(AuthGuard, AdminRolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(OPERATIONS.DRIVER.CREATE)
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
    const { page, limit, search, status, approvalStatus, serviceTypeId } = query;
    const { createdAtFrom, createdAtTo, approvedAtFrom, approvedAtTo, activeAreaId } = query;

    const queryBuilder = this.driversService
      .createQueryBuilder('driver')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .addSelect(['approvedBy.id', 'approvedBy.name'])
      .addSelect(['activeArea.id', 'activeArea.name'])
      .leftJoinAndSelect('driver.serviceTypes', 'serviceTypes')
      .leftJoin('driver.createdBy', 'createdBy')
      .leftJoin('driver.approvedBy', 'approvedBy')
      .leftJoin('driver.activeArea', 'activeArea');

    status && queryBuilder.andWhere('driver.status = :status', { status });
    approvalStatus && queryBuilder.andWhere('driver.approvalStatus = :approvalStatus', { approvalStatus });
    createdAtFrom && queryBuilder.andWhere('driver.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('driver.createdAt <= :createdAtTo', { createdAtTo });
    approvedAtFrom && queryBuilder.andWhere('driver.approvedAt >= :approvedAtFrom', { approvedAtFrom });
    approvedAtTo && queryBuilder.andWhere('driver.approvedAt <= :approvedAtTo', { approvedAtTo });
    activeAreaId && queryBuilder.andWhere('driver.activeAreaId = :activeAreaId', { activeAreaId });
    serviceTypeId && queryBuilder.andWhere('serviceTypes.id = :serviceTypeId', { serviceTypeId });

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
      relations: ['banks', 'serviceTypes', 'emergencyContacts', 'vehicle', 'vehicle.vehicleImages'],
    });
    if (!driver) throw new NotFoundException();

    return driver;
  }

  @Patch(':id')
  @Roles(OPERATIONS.DRIVER.UPDATE)
  async update(@Param('id') id: number, @Body() updateDriverDto: UpdateDriverDto) {
    const { isDraft } = updateDriverDto;
    const driver = await this.driversService.findOne({ where: { id }, relations: { vehicle: true } });
    if (!driver) throw new NotFoundException();

    this.driversService.merge(driver, updateDriverDto);

    if (typeof isDraft === 'boolean' && driver.approvalStatus !== EDriverApprovalStatus.Approved) {
      driver.approvalStatus = isDraft ? EDriverApprovalStatus.Draft : EDriverApprovalStatus.Pending;
    }

    return this.driversService.save(driver);
  }

  @Delete(':id')
  @Roles(OPERATIONS.DRIVER.DELETE)
  async remove(@Param('id') id: number) {
    const driver = await this.driversService.findOne({ where: { id } });
    if (!driver) throw new NotFoundException();

    return this.driversService.remove(driver);
  }

  @Patch(':id/approve')
  @Roles(OPERATIONS.DRIVER.APPROVE)
  async approve(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const store = await this.driversService.findOne({ where: { id, approvalStatus: EDriverApprovalStatus.Pending } });
    if (!store) throw new NotFoundException();

    store.approvedById = user.id;
    store.approvedAt = new Date();
    store.approvalStatus = EDriverApprovalStatus.Approved;

    return this.driversService.save(store);
  }

  @Patch(':id/reject')
  @Roles(OPERATIONS.DRIVER.APPROVE)
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
