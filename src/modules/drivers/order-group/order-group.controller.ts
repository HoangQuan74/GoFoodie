import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { OrderGroupService } from './order-group.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryOrderGroupDto, UpdateOrderGroupItemDto } from './dto';

@Controller('order-group')
@ApiTags('Order-Group')
@UseGuards(AuthGuard)
export class OrderGroupController {
  constructor(private readonly orderGroupService: OrderGroupService) {}

  @Get()
  @ApiOperation({ summary: 'Get current order group' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders for the drivers' })
  getCurrentOrderGroup(@CurrentUser() user: JwtPayload, @Query() query: QueryOrderGroupDto) {
    const { id: driverId } = user;
    const { isConfirmByDriver } = query;
    return this.orderGroupService.getCurrentOrderGroup(driverId, isConfirmByDriver);
  }

  @Get('/cards')
  @ApiOperation({ summary: 'Get current order group' })
  @ApiResponse({ status: 200, description: 'Returns a list of card store and client for the drivers' })
  getCardStoreAndClient(@CurrentUser() user: JwtPayload, @Query() query: QueryOrderGroupDto) {
    const { id: driverId } = user;
    const { isConfirmByDriver } = query;
    return this.orderGroupService.getCardStoreAndClient(driverId, isConfirmByDriver);
  }

  @Patch('/sort')
  @ApiOperation({ summary: 'Update order group item' })
  @ApiResponse({ status: 200, description: 'Returns a list of card store and client for the drivers' })
  sortOrderGroupItem(@CurrentUser() user: JwtPayload, @Body() data: UpdateOrderGroupItemDto) {
    const { id: driverId } = user;
    return this.orderGroupService.sortOrderGroupItem(driverId, data);
  }
}
