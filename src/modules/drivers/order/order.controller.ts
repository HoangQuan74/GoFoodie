import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AssignOrderDto } from './dto/assign-order.dto';
import { UpdateDriverAvailabilityDto } from './dto/update-driver-availability.dto';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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

  @Put(':id')
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
}
