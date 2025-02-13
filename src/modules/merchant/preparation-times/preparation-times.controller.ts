import { Body, Controller, Get, NotFoundException, Put, UseGuards } from '@nestjs/common';
import { PreparationTimesService } from './preparation-times.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { StoresService } from '../stores/stores.service';
import * as _ from 'lodash';
import { UpdatePreparationTimesDto } from './dto/update-preparation-times.dto';

@Controller('preparation-times')
@ApiTags('Preparation Times')
@UseGuards(AuthGuard)
export class PreparationTimesController {
  constructor(
    private readonly preparationTimesService: PreparationTimesService,
    private readonly storesService: StoresService,
  ) {}

  @Get()
  async find(@CurrentStore() storeId: number) {
    const store = await this.storesService.findOne({
      select: { id: true, preparationTime: true },
      where: { id: storeId },
      relations: { preparationTimes: true },
    });

    if (!store) throw new NotFoundException();

    const preparationTimes = _.groupBy(store.preparationTimes, (pt) => {
      return JSON.stringify({
        startTime: pt.startTime,
        endTime: pt.endTime,
        preparationTime: pt.preparationTime,
      });
    });

    return {
      id: store.id,
      preparationTime: store.preparationTime,
      preparationTimes: Object.keys(preparationTimes).map((key) => {
        const preparationTime = preparationTimes[key][0];
        return {
          startTime: preparationTime.startTime,
          endTime: preparationTime.endTime,
          preparationTime: preparationTime.preparationTime,
          dayOfWeek: preparationTimes[key].map((pt) => pt.dayOfWeek),
        };
      }),
    };
  }

  @Put()
  async update(@CurrentStore() storeId: number, @Body() body: UpdatePreparationTimesDto) {
    const store = await this.storesService.findOne({ select: { id: true }, where: { id: storeId } });
    if (!store) throw new NotFoundException();

    const { preparationTime, preparationTimes } = body;
    await this.storesService.save({ ...store, preparationTime });

    await this.preparationTimesService.delete({ storeId });
    await this.preparationTimesService.save(storeId, preparationTimes);
  }
}
