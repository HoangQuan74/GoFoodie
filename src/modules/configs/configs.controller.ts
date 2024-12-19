import { Controller, Get, Query } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { Public } from 'src/common/decorators';
import { ApiQuery } from '@nestjs/swagger';
import { EConfigType } from 'src/common/enums/config.enum';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  @ApiQuery({ name: 'type', type: 'enum', enum: EConfigType, required: false })
  @Public()
  find(@Query() { type }: { type: EConfigType }) {
    const options = type ? { where: { type } } : {};
    return this.configsService.find(options);
  }
}
