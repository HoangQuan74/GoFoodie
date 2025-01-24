import { Brackets, DataSource } from 'typeorm';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { QueryChallengeDto } from './dto/query-challenge.dto';
import { EChallengeStatus } from 'src/common/enums/challenge.enum';
import { EXCEPTIONS } from 'src/common/constants';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';

@Controller('challenges')
@ApiTags('Challenges')
@UseGuards(AuthGuard)
export class ChallengesController {
  constructor(
    private readonly challengesService: ChallengesService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('types')
  async types() {
    return this.challengesService.findTypes();
  }

  @Post()
  create(@Body() body: CreateChallengeDto, @CurrentUser() user: JwtPayload) {
    return this.dataSource.transaction(async (manager) => {
      const { code } = body;

      const isCodeExist = await manager.exists(ChallengeEntity, { where: { code } });
      if (isCodeExist) throw new BadRequestException(EXCEPTIONS.CODE_EXISTED);

      const challenge = new ChallengeEntity();
      Object.assign(challenge, body);
      challenge.createdById = user.id;

      return manager.save(challenge);
    });
  }

  @Get()
  async find(@Query() query: QueryChallengeDto) {
    const { page, limit, search, startTimeFrom, startTimeTo, endTimeFrom, endTimeTo, typeId, status } = query;

    const queryBuilder = this.challengesService
      .createQueryBuilder('challenge')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoinAndSelect('challenge.type', 'type')
      .leftJoinAndSelect('challenge.serviceType', 'serviceType')
      .leftJoin('challenge.createdBy', 'createdBy')
      .orderBy('challenge.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('challenge.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('challenge.code ILIKE :search', { search: `%${search}%` });
          qb.orWhere('type.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('serviceType.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    switch (status) {
      case EChallengeStatus.InProgress:
        queryBuilder.andWhere('challenge.startTime <= :now', { now: new Date() });
        queryBuilder.andWhere('challenge.endTime >= :now', { now: new Date() });
        break;
      case EChallengeStatus.NotStarted:
        queryBuilder.andWhere('challenge.startTime > :now', { now: new Date() });
        queryBuilder.andWhere('challenge.endTime >= :now', { now: new Date() });
        break;
      case EChallengeStatus.Ended:
        queryBuilder.andWhere('challenge.endTime < :now', { now: new Date() });
        break;
    }

    startTimeFrom && queryBuilder.andWhere('challenge.startTime >= :startTimeFrom', { startTimeFrom });
    startTimeTo && queryBuilder.andWhere('challenge.startTime <= :startTimeTo', { startTimeTo });
    endTimeFrom && queryBuilder.andWhere('challenge.endTime >= :endTimeFrom', { endTimeFrom });
    endTimeTo && queryBuilder.andWhere('challenge.endTime <= :endTimeTo', { endTimeTo });
    typeId && queryBuilder.andWhere('challenge.typeId = :typeId', { typeId });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const options = { where: { id: +id }, relations: ['criteria'] };
    const challenge = await this.challengesService.findOne(options);
    if (!challenge) throw new NotFoundException();

    return challenge;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateChallengeDto) {
    const challenge = await this.challengesService.findOne({ where: { id: +id }, relations: ['criteria'] });
    if (!challenge) throw new NotFoundException();

    Object.assign(challenge, body);
    return this.challengesService.save(challenge);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const challenge = await this.challengesService.findOne({ where: { id: +id }, relations: ['criteria'] });
    if (!challenge) throw new NotFoundException();

    await this.challengesService.remove(challenge);
  }
}
