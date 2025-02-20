import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrderGroupService } from './order-group.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';

@Controller('order-group')
@ApiTags('Order-Group')
@UseGuards(AuthGuard)
export class OrderGroupController {
  constructor(private readonly orderGroupService: OrderGroupService) {}

  @Get()
  @ApiOperation({ summary: 'Get current order group' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders for the drivers' })
  getCurrentOrderGroup(@CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.orderGroupService.getCurrentOrderGroup(driverId);
  }
}
