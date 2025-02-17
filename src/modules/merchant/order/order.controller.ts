import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Query orders for merchant' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders based on query parameters' })
  queryOrders(@Query() queryOrderDto: QueryOrderDto, @CurrentUser() user: JwtPayload) {
    const { id: merchantId } = user;
    return this.orderService.queryOrders(merchantId, queryOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific order' })
  @ApiResponse({ status: 200, description: 'Returns the details of the specified order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  getOrderDetails(@Param('id') id: string, @CurrentStore() storeId: number) {
    return this.orderService.findOne(+id, storeId);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm an order' })
  @ApiResponse({ status: 200, description: 'Order confirmed successfully' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  confirmOrder(@Param('id') orderId: string, @CurrentUser() user: JwtPayload) {
    const { id: merchantId } = user;
    return this.orderService.confirmOrder(merchantId, +orderId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  cancelOrder(@Param('id') orderId: string, @CurrentUser() user: JwtPayload, @Body() updateOrderDto: UpdateOrderDto) {
    const { id: merchantId } = user;
    return this.orderService.cancelOrder(merchantId, +orderId, updateOrderDto);
  }
}
