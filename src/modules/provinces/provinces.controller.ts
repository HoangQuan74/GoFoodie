import { Controller, Get } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ProvinceEntity } from 'src/database/entities/province.entity';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('provinces')
@ApiTags('Provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  @Public()
  async find(): Promise<ProvinceEntity[]> {
    return this.provincesService.find();
  }
}
