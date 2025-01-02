import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { Public } from 'src/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdentityQuery } from 'src/common/query';
import { In } from 'typeorm';

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

  @Get(':id/provinces')
  @Public()
  @ApiOperation({ summary: 'Danh sách khu vực hoạt động của loại hình dịch vụ' })
  async findProvincesByServiceType(@Param('id') id: number) {
    const options = { relations: ['provinces'], where: { id } };
    const serviceType = await this.serviceTypesService.findOne(options);
    if (!serviceType) throw new NotFoundException();

    return serviceType.provinces;
  }

  @Get('provinces')
  @Public()
  @ApiOperation({ summary: 'Danh sách khu vực hoạt động của danh sách loại hình dịch vụ' })
  async findProvincesByServiceTypes(@Query() ids: IdentityQuery) {
    const options = { relations: ['provinces'], where: { id: In(ids.ids) } };
    const serviceTypes = await this.serviceTypesService.find(options);

    const provinces = serviceTypes.reduce((acc, serviceType) => {
      serviceType.provinces.forEach((province) => {
        if (!acc.find((p) => p.id === province.id)) acc.push(province);
      });
      return acc;
    }, []);

    return provinces;
  }
}
