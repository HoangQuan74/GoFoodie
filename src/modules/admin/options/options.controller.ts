import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { APP_TYPES, CRITERIA_TYPES } from 'src/common/constants';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ECriteriaType } from 'src/common/enums';
import { ProvincesService } from 'src/modules/provinces/provinces.service';
import { OptionsService } from './options.service';

@Controller('options')
@ApiTags('Options')
@UseGuards(AuthGuard)
export class OptionsController {
  constructor(
    private readonly provincesService: ProvincesService,
    private readonly optionsService: OptionsService,
  ) {}

  @Get('app-types')
  getAppTypes() {
    return this.optionsService.getAppTypes();
  }

  @Get('criteria')
  getCriteria() {
    return CRITERIA_TYPES;
  }

  @Get('criteria/:type')
  getCriteriaByType(@Param('type') type: string) {
    switch (type) {
      case ECriteriaType.Area:
        const provinces = this.provincesService
          .createQueryBuilder('province')
          .select(['province.name as label', 'province.id as value'])
          .getRawMany();
        return provinces;
      default:
        return CRITERIA_TYPES.find((c) => c.value === type).options || [];
    }
  }
}
