import { Controller, Get, Query } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { FindManyOptions } from 'typeorm';
import { DistrictEntity } from 'src/database/entities/district.entity';

@Controller('districts')
@ApiTags('Districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  @Public()
  async find(@Query('provinceId') provinceId: number = 0): Promise<DistrictEntity[]> {
    const options: FindManyOptions<DistrictEntity> = { where: { provinceId }, order: { name: 'ASC' } };
    return this.districtsService.find(options);
  }
}
