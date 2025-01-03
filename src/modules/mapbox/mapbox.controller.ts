import { MAPBOX_ACCESS_TOKEN, MAPBOX_URL } from './../../common/constants';
import { Controller, Get, Param, Query, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { MapboxService } from './mapbox.service';
import { AppGuard } from 'src/app.gaurd';
import axios from 'axios';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

@Controller('mapbox')
@ApiTags('Mapbox')
// @UseGuards(AppGuard)
export class MapboxController {
  constructor(private readonly mapboxService: MapboxService) {}

  @Get('search/searchbox/v1/suggest')
  @Public()
  async search(@Query() query: object) {
    try {
      const { data } = await axios.get(`${MAPBOX_URL}/search/searchbox/v1/suggest`, {
        params: {
          ...query,
          access_token: MAPBOX_ACCESS_TOKEN,
        },
      });

      return data;
    } catch (error) {
      throw new ServiceUnavailableException(error.response.data.error);
    }
  }

  @Get('geocoding/v5/mapbox.places/:query')
  @Public()
  async geocoding(@Query() query: object, @Param('query') queryParam: string) {
    try {
      const { data } = await axios.get(`${MAPBOX_URL}/geocoding/v5/mapbox.places/${queryParam}.json`, {
        params: {
          ...query,
          access_token: MAPBOX_ACCESS_TOKEN,
        },
      });

      return data;
    } catch (error) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new ServiceUnavailableException(message);
    }
  }
}
