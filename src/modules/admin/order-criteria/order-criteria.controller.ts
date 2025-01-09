import { Controller, Get, Query } from '@nestjs/common';
import { OrderCriteriaService } from './order-criteria.service';
import { ApiTags } from '@nestjs/swagger';
import { Post, Body } from '@nestjs/common';
import { CreateOrderCriteriaDto } from './dto/create-order-criteria.dto';

@Controller('order-criteria')
@ApiTags('Order Criteria')
export class OrderCriteriaController {
  constructor(private readonly orderCriteriaService: OrderCriteriaService) {}

  @Get()
  async find() {
    return this.orderCriteriaService.find({ relations: ['serviceType'] });
  }

  @Post()
  async create(@Body() body: CreateOrderCriteriaDto) {
    const { items } = body;

    await this.orderCriteriaService.delete({});
    return this.orderCriteriaService.save(items);
  }
}
