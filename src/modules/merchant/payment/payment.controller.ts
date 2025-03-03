import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment')
@UseGuards(AuthGuard)
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('deposit')
  deposit(@Body() body: CreateDepositDto, @CurrentStore() storeId: number) {
    return this.paymentService.deposit(body, storeId);
  }
}
