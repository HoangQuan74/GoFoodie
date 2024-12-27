import { Controller, Get, UseGuards } from '@nestjs/common';
import { OnlineTrainingsService } from './online-trainings.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('online-trainings')
@UseGuards(AuthGuard)
export class OnlineTrainingsController {
  constructor(private readonly onlineTrainingsService: OnlineTrainingsService) {}

  @Get()
  async find() {
    return this.onlineTrainingsService.find({ relations: ['images'] });
  }
}
