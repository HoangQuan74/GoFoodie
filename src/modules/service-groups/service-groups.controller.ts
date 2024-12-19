import { Controller, Get } from '@nestjs/common';
import { ServiceGroupsService } from './service-groups.service';
import { Public } from 'src/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EServiceGroupStatus } from 'src/common/enums';

@Controller('service-groups')
@ApiTags('Service Groups')
export class ServiceGroupsController {
  constructor(private readonly serviceGroupsService: ServiceGroupsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Danh sách nhóm dịch vụ' })
  async find() {
    return this.serviceGroupsService.find({ where: { status: EServiceGroupStatus.Active } });
  }
}
