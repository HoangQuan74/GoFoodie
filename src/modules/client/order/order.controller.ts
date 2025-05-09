import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { In, Not } from 'typeorm';
import { EstimatedDeliveryTimeDto } from './dto/estimated-delivery-time.dto';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';

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
  cancelOrder(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() updateOrderDto: UpdateOrderDto) {
    const { id: clientId } = user;
    return this.orderService.cancelOrder(clientId, +id, updateOrderDto);
  }

  @Post(':id/reorder')
  @ApiOperation({ summary: 'Initiate reorder process' })
  @ApiResponse({ status: 200, description: 'Returns the ID of a new cart with items from the original order' })
  @ApiParam({ name: 'id', type: String, description: 'Original Order ID' })
  async initiateReorder(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: clientId } = user;
    const newCart = await this.orderService.initiateReorder(clientId, +id);
    return newCart;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  updateOrderStatus(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: userId } = user;
    return this.orderService.updateOrderStatus(+id, EOrderStatus.Pending, userId);
  }

  @Get('delivery/count')
  getDeliveryCount(@CurrentUser() user: JwtPayload) {
    return this.orderService
      .createQueryBuilder('order')
      .where({ status: Not(In([EOrderStatus.Delivered, EOrderStatus.Cancelled])) })
      .andWhere('order.clientId = :userId', { userId: user.id })
      .getCount();
  }

  @Get('delivery/estimate/:storeId')
  getDeliveryEstimate(
    @CurrentUser() user: JwtPayload,
    @Param('storeId') storeId: number,
    @Query() query: EstimatedDeliveryTimeDto,
  ) {
    const { lat, lng, orderDate } = query;
    return this.orderService.calculateEstimatedOrderTime(storeId, orderDate, lat, lng);
  }

  @Post('pre-order')
  createPreOrder(@Body() createOrderDto: CreatePreOrderDto, @CurrentUser() user: JwtPayload) {
    const { id: clientId } = user;
    return this.orderService.createPreOrder(createOrderDto, clientId);
  }
}
