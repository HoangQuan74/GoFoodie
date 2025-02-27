import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { ConfigTimesService } from './config-times.service';
import { UpdateConfigTimeDto } from './dto/update-config-time.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('config-times')
@UseGuards(AuthGuard)
export class ConfigTimesController {
  constructor(private readonly configTimesService: ConfigTimesService) {}

  @Put()
  create(@Body() { data = [] }: UpdateConfigTimeDto) {
    return Promise.all(data.map((item) => this.configTimesService.save(item)));
  }

  @Get()
  async findAll() {
    const configTimes = await this.configTimesService.find();

    return configTimes.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }
}
