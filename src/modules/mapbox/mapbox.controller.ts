import { MAPBOX_ACCESS_TOKEN, MAPBOX_URL } from './../../common/constants';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MapboxService } from './mapbox.service';
import { AppGuard } from 'src/app.gaurd';
import axios from 'axios';

@Controller('mapbox')
@UseGuards(AppGuard)
export class MapboxController {
  constructor(private readonly mapboxService: MapboxService) {}

  @Get('search/searchbox/v1/suggest')
  async search(@Query() query: object) {
    const { data } = await axios.get(`${MAPBOX_URL}/search/searchbox/v1/suggest`, {
      params: {
        ...query,
        access_token: MAPBOX_ACCESS_TOKEN,
      },
    });

    return data;
  }

  @Get('geocoding/v5/mapbox.places/:query')
  async geocoding(@Query() query: object, @Param('query') queryParam: string) {
    const { data } = await axios.get(`${MAPBOX_URL}/geocoding/v5/mapbox.places/${queryParam}.json`, {
      params: {
        ...query,
        access_token: MAPBOX_ACCESS_TOKEN,
      },
    });

    return data;
  }
}
