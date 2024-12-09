import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
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

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto, @CurrentUser() user: JwtPayload) {
    const { isDraft } = createDriverDto;
    const newDriver = new DriverEntity();
    newDriver.createdById = user.id;
    newDriver.approvalStatus = isDraft ? EDriverApprovalStatus.Draft : EDriverApprovalStatus.Pending;
    Object.assign(newDriver, createDriverDto);

    return this.driversService.save(newDriver);
  }

  @Get()
  async find(@Query() query: QueryDriverDto) {
    const { page, limit, search } = query;

    const queryBuilder = this.driversService
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.serviceTypes', 'serviceTypes');

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

    queryBuilder.orderBy('driver.id', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [drivers, total] = await queryBuilder.getManyAndCount();
    return { drivers, total };
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
