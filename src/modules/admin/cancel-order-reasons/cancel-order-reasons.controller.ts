import { Controller, Get, Query, UseGuards, Post, Body } from '@nestjs/common';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';
import { AuthGuard } from '../auth/auth.guard';
import { PaginationQuery } from 'src/common/query';
import { CreateCancelOrderReasonsDto } from './dto/create-cancel-order-reason.dto';
import { ApiTags } from '@nestjs/swagger';
import { In, Not } from 'typeorm';

@Controller('cancel-order-reasons')
@ApiTags('Cancel Order Reasons')
@UseGuards(AuthGuard)
export class CancelOrderReasonsController {
  constructor(private readonly cancelOrderReasonsService: CancelOrderReasonsService) {}

  @Get()
  async find(@Query() query: PaginationQuery) {
    const { page, limit } = query;

    const options = { skip: (page - 1) * limit, take: limit, relations: ['appTypes'] };
    const [items, total] = await this.cancelOrderReasonsService.findAndCount(options);

    return { items, total };
  }

  @Post()
  async create(@Body() createCancelOrderReasonDto: CreateCancelOrderReasonsDto) {
    const { reasons } = createCancelOrderReasonDto;

    const reasonIds = reasons.map((reason) => reason.id).filter((id) => id);
    await this.cancelOrderReasonsService.delete({ id: Not(In(reasonIds)) });

    for (const reason of reasons) {
      await this.cancelOrderReasonsService.save(reason);
    }
  }
}
