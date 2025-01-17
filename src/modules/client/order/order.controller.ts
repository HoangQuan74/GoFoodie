import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryOrderDto } from 'src/modules/merchant/order/dto/query-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('Orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    const { id: clientId } = user;
    return this.orderService.create(createOrderDto, clientId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for a client' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders for the client' })
  getClientOrders(@Query() queryOrderDto: QueryOrderDto, @CurrentUser() user: JwtPayload) {
    const { id: clientId } = user;
    return this.orderService.findAllByClient(clientId, queryOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific order' })
  @ApiResponse({ status: 200, description: 'Returns the details of the specified order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  getOrderDetails(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: clientId } = user;
    return this.orderService.findOne(clientId, +id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  cancelOrder(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: clientId } = user;
    return this.orderService.cancelOrder(clientId, +id);
  }
}
