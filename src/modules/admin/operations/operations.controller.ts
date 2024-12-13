import { Controller, Get, UseGuards } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('operations')
@UseGuards(AuthGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  find() {
    return this.operationsService.find();
  }
}
