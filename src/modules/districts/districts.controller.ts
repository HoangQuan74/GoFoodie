import { Controller, Get, Query } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

@Controller('districts')
@ApiTags('Districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  @Public()
  async find(@Query('provinceId') provinceId: number = 0) {
    const options = { where: { provinceId } };
    return this.districtsService.find(options);
  }
}
