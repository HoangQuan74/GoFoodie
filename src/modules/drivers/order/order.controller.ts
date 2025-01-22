import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AssignOrderDto } from './dto/assign-order.dto';
import { UpdateDriverAvailabilityDto } from './dto/update-driver-availability.dto';
import { OrderService } from './order.service';
import { UpdateStatusDto } from './dto/update-status-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Controller('order')
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Put()
  @ApiOperation({ summary: 'Update driver availability' })
  @ApiResponse({ status: 200, description: 'Driver availability updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAvailability(
    @Body() updateDriverAvailabilityDto: UpdateDriverAvailabilityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const { id: driverId } = user;
    return this.orderService.updateDriverAvailability(
      driverId,
      updateDriverAvailabilityDto.isAvailable,
      updateDriverAvailabilityDto.latitude,
      updateDriverAvailabilityDto.longitude,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers orders for a drivers' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders for the drivers' })
  getDriverOfferOrders(@Query() queryOrderDto: QueryOrderDto, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.orderService.findAllByClient(driverId, queryOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details for driver' })
  @ApiResponse({ status: 200, description: 'Returns the order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  async getOrderDetails(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.orderService.getOrderDetailsForDriver(id, driverId);
  }

  @Put(':id/accept')
  @ApiOperation({ summary: 'Accept an order' })
  @ApiResponse({ status: 200, description: 'Order accepted successfully' })
  @ApiResponse({ status: 400, description: 'Unable to accept the order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  async acceptOrder(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.orderService.acceptOrderByDriver(id, driverId);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject an order' })
  @ApiResponse({ status: 200, description: 'Order rejected successfully' })
  @ApiResponse({ status: 400, description: 'Unable to reject the order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  async rejectOrder(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.orderService.rejectOrderByDriver(id, driverId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update status order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, description: 'Unable to update the order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  async updateStatus(@Param('id') id: number, @Body() statusDto: UpdateStatusDto, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.orderService.updateStatus(id, driverId, statusDto.status);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign an order to a driver' })
  @ApiResponse({ status: 200, description: 'Order assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async assignOrder(@Body() assignOrderDto: AssignOrderDto) {
    if (assignOrderDto.driverId) {
      // If a specific driver is provided, assign to that driver
      return this.orderService.assignOrderToSpecificDriver(assignOrderDto.orderId, assignOrderDto.driverId);
    } else {
      // If no driver is specified, use the automatic assignment logic
      return this.orderService.assignOrderToDriver(assignOrderDto.orderId);
    }
  }
}
