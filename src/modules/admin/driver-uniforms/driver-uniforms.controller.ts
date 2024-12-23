import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DriverUniformsService } from './driver-uniforms.service';
import { CreateDriverUniformDto } from './dto/create-driver-uniform.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('driver-uniforms')
@ApiTags('Driver Uniforms')
@UseGuards(AuthGuard)
export class DriverUniformsController {
  constructor(private readonly driverUniformsService: DriverUniformsService) {}

  @Post()
  async create(@Body() createDriverUniformDto: CreateDriverUniformDto) {
    const uniform = await this.driverUniformsService.findOne({ where: {} });
    Object.assign(createDriverUniformDto, { id: uniform?.id });

    return this.driverUniformsService.save(createDriverUniformDto);
  }

  @Get()
  async find() {
    const options = { where: {}, relations: ['sizes', 'uniformImages'] };
    return this.driverUniformsService.findOne(options);
  }
}
