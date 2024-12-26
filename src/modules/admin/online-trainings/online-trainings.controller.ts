import { Body, Controller, Get, Post } from '@nestjs/common';
import { OnlineTrainingsService } from './online-trainings.service';
import { CreateOnlineTrainingDto } from './dto/create-online-training.dto';

@Controller('online-trainings')
export class OnlineTrainingsController {
  constructor(private readonly onlineTrainingsService: OnlineTrainingsService) {}

  @Get()
  async find() {
    return this.onlineTrainingsService.find({ relations: ['images'] });
  }

  @Post()
  async create(@Body() createOnlineTrainingDto: CreateOnlineTrainingDto) {
    const { items = [] } = createOnlineTrainingDto;
    await this.onlineTrainingsService.clear();
    return this.onlineTrainingsService.create(items);
  }
}
