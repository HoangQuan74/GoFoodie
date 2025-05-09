import { GOONG_API_KEY, GOONG_URL, MAPBOX_ACCESS_TOKEN, MAPBOX_URL } from './../../common/constants';
import { Body, Controller, Get, Param, Post, Query, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { MapboxService } from './mapbox.service';
import { AppGuard } from 'src/app.gaurd';
import axios from 'axios';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { SearchReverseDto } from './dto/search-reverse.dto';
import { SearchForwardDto } from './dto/search-forward.dto';
import { QueryDistanceDto } from './dto/query-distance.dto';

@Controller('mapbox')
@ApiTags('Mapbox')
@UseGuards(AppGuard)
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
      console.log(error.response.data);
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
      const message = error.response?.data?.message || error.response?.data?.error;
      throw new ServiceUnavailableException(message);
    }
  }

  @Get('directions/v5/mapbox/driving-traffic/:coordinates')
  async directions(@Query() query: object, @Param('coordinates') coordinates: string) {
    try {
      const { data } = await axios.get(`${MAPBOX_URL}/directions/v5/mapbox/driving-traffic/${coordinates}`, {
        params: {
          ...query,
          access_token: MAPBOX_ACCESS_TOKEN,
        },
      });

      return data;
    } catch (error) {
      console.log(error.response.data);
      throw new ServiceUnavailableException(error.response.data.error);
    }
  }

  @Get('directions/v5/mapbox/driving/:coordinates')
  async directionsDriving(@Query() query: object, @Param('coordinates') coordinates: string) {
    try {
      const { data } = await axios.get(`${MAPBOX_URL}/directions/v5/mapbox/driving/${coordinates}`, {
        params: {
          ...query,
          access_token: MAPBOX_ACCESS_TOKEN,
        },
      });

      return data;
    } catch (error) {
      console.log(error.response.data);
      throw new ServiceUnavailableException(error.response.data.error);
    }
  }

  @Get('search/forward')
  async searchAddress(@Query() query: SearchForwardDto) {
    const { search, limit } = query;

    const { data } = await axios.get(`${GOONG_URL}/geocode`, {
      params: {
        api_key: GOONG_API_KEY,
        address: search,
        limit,
      },
    });

    const result = data.results.map((result) => ({
      id: result.place_id,
      name: result.name,
      address: result.formatted_address,
      location: result.geometry.location,
    }));

    return result;
  }

  @Get('search/reverse')
  async reverseAddress(@Query() query: SearchReverseDto) {
    const { latitude, longitude } = query;

    const { data } = await axios.get(`${GOONG_URL}/Geocode`, {
      params: {
        api_key: GOONG_API_KEY,
        latlng: latitude + ',' + longitude,
      },
    });

    const result = data.results.map((result) => ({
      id: result.place_id,
      address: result.formatted_address,
      location: result.geometry.location,
    }));

    return result;
  }

  @UseGuards(AppGuard)
  @Post('/distance')
  async getDistanceAndDuration(@Body() body: QueryDistanceDto) {
    return this.mapboxService.getDistanceAndDuration(body.startingPosition, body.destinationPosition, body.vehicle);
  }
}
