import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import { QueryOrderDto } from 'src/modules/merchant/order/dto/query-order.dto';

@Controller('orders')
@ApiTags('Orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders for a client' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders for the client' })
  @ApiQuery({ name: 'clientId', type: Number, required: true })
  getClientOrders(@Query('clientId') clientId: number, @Query() queryOrderDto: QueryOrderDto) {
    return this.orderService.findAllByClient(clientId, queryOrderDto);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get details of a specific order' })
  @ApiResponse({ status: 200, description: 'Returns the details of the specified order' })
  @ApiQuery({ name: 'clientId', type: Number, required: true })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  getOrderDetails(@Query('clientId') clientId: number, @Param('id') id: string) {
    return this.orderService.findOne(clientId, +id);
  }

  @Patch('orders/:id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiQuery({ name: 'clientId', type: Number, required: true })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  cancelOrder(@Query('clientId') clientId: number, @Param('id') id: string) {
    return this.orderService.cancelOrder(clientId, +id);
  }
}
