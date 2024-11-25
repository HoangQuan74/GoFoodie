import { Controller, Get } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { Public } from 'src/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('service-types')
@ApiTags('Service Types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Danh sách loại hình dịch vụ' })
  async find() {
    return this.serviceTypesService.find();
  }
}
