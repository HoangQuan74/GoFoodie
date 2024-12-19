import { Controller, Get, Query } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { Public } from 'src/common/decorators';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EConfigType } from 'src/common/enums/config.enum';

@Controller('configs')
@ApiTags('Configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  @ApiQuery({ name: 'type', type: 'enum', enum: EConfigType, required: true })
  @Public()
  async find(@Query() { type }: { type: EConfigType }) {
    const options = { where: { type } };
    const configs = await this.configsService.find(options);

    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {});
  }
}
