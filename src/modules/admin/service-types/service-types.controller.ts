import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('service-types')
@ApiTags('Quản lý loại hình dịch vụ')
@UseGuards(AuthGuard)
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách loại hình dịch vụ' })
  async find() {
    return this.serviceTypesService.find({ relations: ['provinces'] });
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin loại hình dịch vụ' })
  async create(@Body() body: UpdateServiceTypeDto) {
    return this.serviceTypesService.save(body);
  }
}
