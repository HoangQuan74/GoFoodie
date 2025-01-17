import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderService } from './order.service';

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

  @Patch(':merchantId/orders/:orderId/confirm')
  @ApiOperation({ summary: 'Confirm an order' })
  @ApiResponse({ status: 200, description: 'Order confirmed successfully' })
  confirmOrder(@Param('orderId') orderId: string, @CurrentUser() user: JwtPayload) {
    const { id: merchantId } = user;
    return this.orderService.confirmOrder(merchantId, +orderId);
  }

  @Patch(':merchantId/orders/:orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  cancelOrder(@Param('orderId') orderId: string, @CurrentUser() user: JwtPayload) {
    const { id: merchantId } = user;
    return this.orderService.cancelOrder(merchantId, +orderId);
  }
}
