import { Controller, Get, Query } from '@nestjs/common';
import { WardsService } from './wards.service';
import { WardEntity } from 'src/database/entities/ward.entity';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('wards')
@ApiTags('Wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  @Public()
  async find(@Query('districtId') districtId: number = 0): Promise<WardEntity[]> {
    const options = { where: { districtId } };
    return this.wardsService.find(options);
  }
}
