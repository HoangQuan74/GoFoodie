import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UniformsService } from './uniforms.service';
import { CreateDriverUniformDto } from './dto/create-driver-uniform.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('driver-uniforms')
@ApiTags('Driver Uniforms')
@UseGuards(AuthGuard)
export class UniformsController {
  constructor(private readonly uniformsService: UniformsService) {}

  @Post()
  async create(@Body() createDriverUniformDto: CreateDriverUniformDto) {
    const uniform = await this.uniformsService.findOne({ where: {} });
    Object.assign(createDriverUniformDto, { id: uniform?.id });

    return this.uniformsService.save(createDriverUniformDto);
  }

  @Get()
  async find() {
    const options = { where: {}, relations: ['sizes', 'uniformImages', 'contractFile'] };
    return this.uniformsService.findOne(options);
  }
}
