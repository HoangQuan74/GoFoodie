import { Controller, Get, UseGuards } from '@nestjs/common';
import { MapboxService } from './mapbox.service';
import { AppGuard } from 'src/app.gaurd';
// import axios from 'axios';

@Controller('mapbox')
@UseGuards(AppGuard)
export class MapboxController {
  constructor(private readonly mapboxService: MapboxService) {}

  // path /mapbox*
  @Get('search/searchbox/v1/suggest')
  async search() {
    // const { data } = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places', {
    //   params: {
    //     access_token: process.env.MAPBOX_ACCESS_TOKEN,
    //     ...this.mapboxService.searchParams,
    //   },
    // });

    // return data;
  }
}
