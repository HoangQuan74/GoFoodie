import { DataSource } from 'typeorm';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { FindRequestDto } from './dto/find-request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { ERequestStatus } from 'src/common/enums';

@Controller('requests')
@ApiTags('Requests')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('types')
  async getTypes() {
    return this.requestsService.getTypes();
  }

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto, @CurrentUser() user: JwtPayload) {
    const code = await this.requestsService.generateCode();

    const request = new DriverRequestEntity();
    request.code = code;
    request.driverId = user.id;
    Object.assign(request, createRequestDto);

    return this.requestsService.save(request);
  }

  @Get()
  async find(@Query() query: FindRequestDto, @CurrentUser() user: JwtPayload) {
    const { page, limit, status } = query;
    const queryBuilder = this.requestsService
      .createQueryBuilder('request')
      .where('request.driverId = :driverId', { driverId: user.id })
      .withDeleted()
      .addSelect(['type.id', 'type.name'])
      .innerJoin('request.type', 'type')
      .orderBy('request.id', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    status && queryBuilder.andWhere('request.status = :status', { status });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const request = await this.requestsService.findOne({
      select: { driver: { id: true, phoneNumber: true, fullName: true }, type: { id: true, name: true } },
      where: { id, driverId: user.id },
      relations: ['files', 'driver', 'type'],
    });
    if (!request) throw new NotFoundException();

    return request;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto, @CurrentUser() user: JwtPayload) {
    const request = await this.requestsService.findOne({
      where: { id, driverId: user.id, status: ERequestStatus.Rejected },
    });
    if (!request) throw new NotFoundException();

    return this.requestsService.save({ ...request, ...updateRequestDto });
  }
}
