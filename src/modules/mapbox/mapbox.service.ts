import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GOONG_API_KEY, GOONG_URL } from 'src/common/constants';
import { EVehicleType } from 'src/common/enums/map.enum';
import { IDistanceAndDuration, ILocation } from 'src/common/interfaces/map.interface';

@Injectable()
export class MapboxService {
  constructor() {}

  async getDistanceAndDuration(
    origin: ILocation,
    destination: ILocation[],
    vehicle: EVehicleType = EVehicleType.Car,
  ): Promise<IDistanceAndDuration[]> {
    const { data } = await axios.get(`${GOONG_URL}/DistanceMatrix`, {
      params: {
        api_key: GOONG_API_KEY,
        origins: `${origin.lat},${origin.lng}`,
        destinations: destination.map((loc) => `${loc.lat},${loc.lng}`).join('|'),
        vehicle,
      },
    });

    return data.rows[0].elements.map((element) => ({
      distance: element.distance.value,
      duration: element.duration.value,
    }));
  }
}
